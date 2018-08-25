import * as React from 'react';
import { ModalContext, ModalContextProps } from './ModalContext';
import Sticky from '../Sticky';
import classNames from 'classnames';
import Close from './ModalClose';
import { Emitter, ChildrenActions } from './ModaChildEmitter';

import styles = require('./Modal.less');

export interface HeaderProps {
  close?: boolean;
}

export class Header extends React.Component<HeaderProps> {
  private static additionalPadding = false;

  public componentWillMount() {
    Emitter.emit(ChildrenActions.HeaderMount);

    Emitter.addListener(ChildrenActions.FooterMount, (params: {hasPanel: boolean}) => {
      if (params.hasPanel) {
        Header.additionalPadding = true;
      }
    });
    
    Emitter.addListener(ChildrenActions.FooterUnmount, () => {
      Header.additionalPadding = true;
    });
  }

  public componentWillUnmount() {
    Emitter.emit(ChildrenActions.HeaderUnmount);
  }

  public render(): JSX.Element {
    return (
      <ModalContext.Consumer>
        {(props: ModalContextProps) => (
          <Sticky side="top">
            {fixed => (
              <div
                className={classNames(
                  styles.header,
                  fixed && styles.fixedHeader,
                  Header.additionalPadding && styles.headerAddPadding
                )}
              >
                <div className={styles.absoluteClose}>
                    <Close
                      requestClose={props.close.requestClose}
                      disableClose={props.close.disableClose}
                    />
                  </div>
                {this.props.children}
              </div>
            )}
          </Sticky>
        )}
      </ModalContext.Consumer>
    );
  }
}
