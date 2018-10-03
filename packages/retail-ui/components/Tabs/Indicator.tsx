import * as React from 'react';
import { findDOMNode } from 'react-dom';
import cn from 'classnames';
import LayoutEvents from '../../lib/LayoutEvents';
import throttle from 'lodash.throttle';
import Tab, { TabIndicators } from './Tab';

import styles = require('./Indicator.less');
import { Nullable } from '../../typings/utility-types';

export interface IndicatorProps {
  className?: string;
  getAnchorNode: () => Tab | null;
  tabUpdates: {
    on: (x0: () => void) => () => void;
  };
  vertical: boolean;
}

export interface IndicatorState {
  styles: React.CSSProperties;
}

class Indicator extends React.Component<IndicatorProps, IndicatorState> {
  public state: IndicatorState = {
    styles: {}
  };

  private _eventListener: Nullable<{
    remove: () => void;
  }> = null;
  private _removeTabUpdatesListener: Nullable<() => void> = null;

  public componentDidMount() {
    this._eventListener = LayoutEvents.addListener(throttle(this._reflow, 100));
    this._removeTabUpdatesListener = this.props.tabUpdates.on(this._reflow);
    this._reflow();
  }

  public componentWillUnmount() {
    if (this._eventListener) {
      this._eventListener.remove();
    }
    if (this._removeTabUpdatesListener) {
      this._removeTabUpdatesListener();
    }
  }

  public componentDidUpdate(_: IndicatorProps, prevState: IndicatorState) {
    this._reflow();
  }

  public render() {
    const node = this.props.getAnchorNode();
    const indicators: TabIndicators = (node &&
      node.getIndicators &&
      node.getIndicators()) || {
      error: false,
      warning: false,
      success: false,
      primary: false,
      disabled: false
    };
    return (
      <div
        className={cn(
          styles.root,
          indicators.primary && styles.primary,
          indicators.success && styles.success,
          indicators.warning && styles.warning,
          indicators.error && styles.error,
          this.props.className
        )}
        style={this.state.styles}
      />
    );
  }

  private _reflow = () => {
    const node = this.props.getAnchorNode();
    const underlyingNode = node && node.getUnderlyingNode();
    const nodeStyles = this._getStyles(underlyingNode);
    const stylesUpdated = ['left', 'top', 'width', 'height'].some(
      prop =>
        nodeStyles[prop as keyof React.CSSProperties] !==
        this.state.styles[prop as keyof React.CSSProperties]
    );
    if (stylesUpdated) {
      this.setState({ styles: nodeStyles });
    }
  };

  private _getStyles(node: any): React.CSSProperties {
    if (node instanceof React.Component) {
      node = findDOMNode(node);
    }

    if (!node) {
      return {};
    }

    // better to check node instanceof HTMLElement
    // but it fails in ie8
    // eslint-disable-next-line flowtype/no-weak-types
    const _node: HTMLElement = node;

    const rect = _node.getBoundingClientRect();
    if (this.props.vertical) {
      return {
        width: 3,
        left: _node.offsetLeft,
        top: _node.offsetTop,
        height: rect.bottom - rect.top
      };
    }
    return {
      left: _node.offsetLeft,
      top: _node.offsetHeight + _node.offsetTop - 3,
      width: rect.right - rect.left
    };
  }
}

export default Indicator;
