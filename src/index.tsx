import React from 'react';
import {from, Observable, Subject, Subscription} from 'rxjs';
import { debounceTime, takeUntil, tap, switchMap } from 'rxjs/operators';

interface Props {
  source: (str: string) => Promise<string[]>;
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

  // 更新 Input 框中的搜索词
  setSearchStr: (str: string) => void = (str) => {
    this.setState({
      inputValue: str,
    });
  };
  // 更新搜索状态
  setLoading: (isLoading: boolean) => void = (isLoading) => {
    this.setState({
      isLoading,
    });
  };
  // 显示或隐藏警告信息
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
  // 发送请求，获取搜索结果
  searchQuery: (str: string) => Observable<string[]> = (str) => {
    return from(this.props.source(str));
  };
  // 更新搜索结果列表
  setSearchResults: (options: string[]) => void = (options) => {
    this.setState({
      searchResults: options
    });
  };

  // 你要实现的方法
  getAutoSearch = () => {
    const search$ = this.payload$.pipe(
      tap(console.log),
      switchMap(
        (str) => this.searchQuery(str).pipe(
          takeUntil(this.payload$),
          debounceTime(500),
          tap((options) => {
            this.setSearchResults(options);
          })
        )
      )
    );

    return search$;
  }

  handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    this.payload$.next(e.currentTarget.value);
  }
  render() {
    return (
      <div className="auto-complete">
        <input className="input" onInput={this.handleInput} />
        <div className="options">
          {this.state.searchResults.map(option => (
            <div className="option">{option}</div>
          ))}
        </div>
      </div>
    );
  }
}
