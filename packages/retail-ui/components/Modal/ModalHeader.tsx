import * as React from 'react';
import { ModalContext } from './ModalContext';
import Sticky from '../Sticky';
import classNames from 'classnames';
import Close from './ModalClose';
import ModalChildEmitter from './ModaChildEmitter';

import styles = require('./Modal.less');

export interface HeaderProps {
  close?: boolean;
}

export class Header extends React.Component<HeaderProps> {
  public componentWillMount() {
    ModalChildEmitter.emit('childRenderState', {
      child: 'header', 
      willMount: true
    });
  }

  public componentWillUnmount() {
    ModalChildEmitter.emit('childRenderState', {
      child: 'header', 
      willUnmount: true
    });
  }

  public render(): JSX.Element {
    return (
      <ModalContext.Consumer>
        {({ close, additionalPadding }) => (
          <Sticky side="top">
            {fixed => (
              <div
                className={classNames(
                  styles.header,
                  fixed && styles.fixedHeader,
                  additionalPadding && styles.headerAddPadding
                )}
              >
                {close && (
                  <div className={styles.absoluteClose}>
                    <Close
                      requestClose={close.requestClose}
                      disableClose={close.disableClose}
                    />
                  </div>
                )}
                {this.props.children}
              </div>
            )}
          </Sticky>
        )}
      </ModalContext.Consumer>
    );
  }
}
