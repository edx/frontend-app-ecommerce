import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';

import { BasicAlert } from '../components';

import SubscriptionCardsView from './SubscriptionCardsView';
import SubscriptionUpsell from './SubscriptionUpsell';

import { clearStripeError } from './actions';
import { subscriptionsSelector } from './selectors';

import messages from './Subscriptions.messages';

const Subscriptions = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const {
    subscriptions,
    stripeError,
  } = useSelector(subscriptionsSelector);
  const hasSubscriptions = subscriptions.length > 0;
  const activeCount = subscriptions.filter(
    ({ status }) => ['active', 'trial'].includes(status),
  ).length;

  const subtitle = {
    0: 'ecommerce.order.history.subscriptions.subtitle.zero',
    1: 'ecommerce.order.history.subscriptions.subtitle.one',
    2: 'ecommerce.order.history.subscriptions.subtitle.multiple',
  }[Math.min(activeCount, 2)];

  const handeAlertClose = () => {
    dispatch(clearStripeError());
  };

  const renderEmpty = () => (
    <>
      <FormattedMessage
        id="ecommerce.order.history.subscriptions.subtitle.empty"
        defaultMessage="You do not have any active or previous subscriptions."
        description="Subtitle for subscriptions section when there are no subscriptions."
      >
        {(text) => <span className="text-dark-900">{text}</span>}
      </FormattedMessage>
      <SubscriptionUpsell />
    </>
  );

  const renderSubscriptions = () => (
    <>
      <div className="section flex-md-row align-items-start align-items-md-center justify-content-between">
        <span className="text-dark-900" data-testid="subscription-subtitle">
          {formatMessage(messages[subtitle], {
            activeCount,
          })}
        </span>
      </div>
      <SubscriptionCardsView subscriptions={subscriptions} />
      <BasicAlert isModal isVisible={stripeError} onClose={handeAlertClose} />
    </>
  );

  return (
    <section>
      <FormattedMessage
        tagName="h2"
        id="ecommerce.order.history.subscriptions.heading"
        defaultMessage="Subscriptions"
        description="Heading for subscriptions section."
      />
      {hasSubscriptions ? renderSubscriptions() : renderEmpty()}
    </section>
  );
};

export default Subscriptions;
