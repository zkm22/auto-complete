import React from 'react';
import { from, Subject } from 'rxjs';
import { debounceTime, takeUntil, tap, switchMap } from 'rxjs/operators';
export class AutoComplete extends React.Component {
    constructor(props, state) {
        super(props, state);
        this.payload$ = new Subject();
        // 更新 Input 框中的搜索词
        this.setSearchStr = (str) => {
            this.setState({
                inputValue: str,
            });
        };
        // 更新搜索状态
        this.setLoading = (isLoading) => {
            this.setState({
                isLoading,
            });
        };
        // 显示或隐藏警告信息
        this.toggleWarning = (isShown) => {
            if (isShown !== undefined) {
                this.setState({
                    warningShow: isShown
                });
            }
            else {
                this.setState((state) => ({
                    warningShow: !state.warningShow
                }));
            }
        };
        // 发送请求，获取搜索结果
        this.searchQuery = (str) => {
            return from(this.props.source(str));
        };
        // 更新搜索结果列表
        this.setSearchResults = (options) => {
            this.setState({
                searchResults: options
            });
        };
        // 你要实现的方法
        this.getAutoSearch = () => {
            const search$ = this.payload$.pipe(tap(console.log), switchMap((str) => this.searchQuery(str).pipe(takeUntil(this.payload$), debounceTime(500), tap((options) => {
                this.setSearchResults(options);
            }))));
            return search$;
        };
        this.handleInput = (e) => {
            this.payload$.next(e.currentTarget.value);
        };
        this.state = {
            inputValue: '',
            searchResults: [],
            isLoading: false,
            warningShow: false,
        };
        this.subscription = this.getAutoSearch().subscribe();
    }
    render() {
        return (React.createElement("div", { className: "auto-complete" },
            React.createElement("input", { className: "input", onInput: this.handleInput }),
            React.createElement("div", { className: "options" }, this.state.searchResults.map(option => (React.createElement("div", { className: "option" }, option))))));
    }
}
