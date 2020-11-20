import React, {CSSProperties} from 'react';
import {from, Observable, Subject, Subscription} from 'rxjs';
import { debounceTime, takeUntil, tap, switchMap, filter } from 'rxjs/operators';
import './index.css';

interface ACStyle extends CSSProperties {
  '--width'?: string;
  '--font-size': string;
}
const defaultVars: ACStyle = {
  '--font-size': '16px',
  '--width': '120px',
}
interface Props {
  source: (str: string) => Promise<string[]>;
  width?: string;
}
interface State {
  inputValue: string;
  isLoading: boolean;
  searchResults: string[];
  warningShow: boolean;
}

export class AutoComplete extends React.Component<Props, State> {
  payload$: Subject<string> = new Subject();

  subscription: Subscription;

  constructor(props: Props, state: State) {
    super(props, state);
    this.state = {
      inputValue: '',
      searchResults: [],
      isLoading: false,
      warningShow: false,
    };
    this.subscription = this.getAutoSearch().subscribe();
  }
  setSearchStr: (str: string) => void = (str) => {
    this.setState({
      inputValue: str,
    });
  };
  setLoading: (isLoading: boolean) => void = (isLoading) => {
    this.setState({
      isLoading,
    });
  };
  toggleWarning: (isShown?: boolean) => void = (isShown) => {
    if (isShown !== undefined) {
      this.setState({
        warningShow: isShown
      });
    } else {
      this.setState((state) =>
        ({
          warningShow: !state.warningShow
        })
      );
    }
  };
  searchQuery: (str: string) => Observable<string[]> = (str) => {
    return from(this.props.source(str));
  };
  setSearchResults: (options: string[]) => void = (options) => {
    this.setState({
      searchResults: options
    });
  };
  getAutoSearch = () => {
    const search$ = this.payload$.pipe(
      filter((str) => {
        if (str.length > 30 || str.length === 0) {
          this.setLoading(false);
          this.toggleWarning(true);
          return false;
        }
        this.setLoading(true);
        this.toggleWarning(false);
        this.setSearchStr(str);
        return true;
      }),
      debounceTime(500),
      switchMap(
        (str) => this.searchQuery(str).pipe(
          takeUntil(this.payload$),
          tap((options) => {
            this.setLoading(false);
            this.setSearchResults(options);
          })
        )
      )
    );
    return search$;
  }
  handleOptionClick = (option: string) => {
    this.setSearchStr(option);
    window.setTimeout(() => {
      this.setState({
        searchResults: [],
      });
    }, 100);
  }
  handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this.payload$.next(e.currentTarget.value);
  }
  componentWillUnmount () {
    this.payload$.unsubscribe()
  }
  render() {
    return (
      <div
        className="__auto-complete"
        style={{
          '--font-size': defaultVars['--font-size'],
          '--width': this.props.width || defaultVars['--width'],
        } as ACStyle}>
        <input className="input" onInput={this.handleInput} value={this.state.inputValue} />
        {this.state.warningShow&&<span className="warning">超出30个字符</span>}
        <div
          className="options"
          style={{
            height: `calc(${this.state.searchResults.length} * var(--font-size))`
          }}
          >
          {this.state.searchResults.map(option => (
            <div
              className="option"
              key={option}
              onClick={()=>this.handleOptionClick(option)}>{option}</div>
          ))}
        </div>
      </div>
    );
  }
}
