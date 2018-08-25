import * as React from 'react';
import { ModalContext, ModalContextProps } from './ModalContext';

import styles = require('./Modal.less');
import classNames from 'classnames';
import Close from './ModalClose';
import {Emitter, ChildrenActions} from './ModaChildEmitter';

export class Body extends React.Component {
  private static modalHasHeader = false;
  private static additionalPadding = false;

  public componentWillMount() {
    Emitter.addListener(ChildrenActions.HeaderMount, () => {
      Body.modalHasHeader = true;
    });

    Emitter.addListener(ChildrenActions.HeaderUnmount, () => {
      Body.modalHasHeader = false;
    })

    Emitter.addListener(ChildrenActions.FooterMount, (params: {hasPanel: boolean}) => {
      Body.modalHasHeader = true;
      if (params.hasPanel) {
        Body.additionalPadding = true;
      }
    });

    Emitter.addListener(ChildrenActions.FooterUnmount, () => {
      Body.additionalPadding = true;
    });
  }

  public render(): JSX.Element {
    return (
      <ModalContext.Consumer>
        {(props: ModalContextProps) => (
          <div
            className={classNames(
              styles.body,
              !Body.modalHasHeader && styles.bodyWithoutHeader,
              Body.additionalPadding && styles.bodyAddPadding
            )}
          >
          {!Body.modalHasHeader && !props.close.noClose ? (
                    <Close
                      requestClose={props.close.requestClose}
                      disableClose={props.close.disableClose}
                    />
                  ) : null}
            {this.props.children}
          </div>
        )}
      </ModalContext.Consumer>
    );
  }
}
