import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedNumber, FormattedDate } from 'react-intl';
import { Table, Hyperlink, Pagination } from '@edx/paragon';

import messages from './OrderHistoryPage.messages';

// Actions
import { fetchOrders } from './actions';
import { pageSelector } from './selectors';


class OrderHistoryPage extends React.Component {
  constructor(props) {
    super(props);

    this.handlePageSelect = this.handlePageSelect.bind(this);
  }
  componentDidMount() {
    // TODO: We should fetch based on the route (ex: /orders/list/page/1)
    this.props.fetchOrders(1);
  }

  getTableData() {
    return this.props.orders.map(({
      lineItems,
      datePlaced,
      total,
      currency,
      orderId,
      receiptUrl,
    }) => ({
      description: this.renderLineItems(lineItems),
      datePlaced: <FormattedDate value={new Date(datePlaced)} />,
      // eslint-disable-next-line react/style-prop-object
      total: <FormattedNumber value={total} style="currency" currency={currency} />,
      receiptUrl: (
        <Hyperlink destination={receiptUrl}>
          {this.props.intl.formatMessage(messages['ecommerce.order.history.view.order.detail'])}
        </Hyperlink>
      ),
      orderId,
    }), this);
  }

  handlePageSelect(page) {
    // TODO: We should update the url and trigger this fetching based on the route
    this.props.fetchOrders(page);
  }

  renderPagination() {
    const {
      pageCount,
      currentPage,
    } = this.props;

    if (pageCount <= 1) return null;

    return (
      <Pagination
        paginationLabel="pagination navigation"
        pageCount={pageCount}
        currentPage={currentPage}
        onPageSelect={this.handlePageSelect}
      />
    );
  }

  renderLineItems(lineItems) {
    return lineItems.map(({
      itemId,
      description,
      quantity,
    }) => (
      <p className="d-flex" key={itemId}>
        <span className="mr-3">{quantity}x</span>
        <span>{description}</span>
      </p>
    ));
  }

  renderOrdersTable() {
    return (
      <React.Fragment>
        <Table
          className="order-history"
          data={this.getTableData()}
          columns={[
            {
              label: this.props.intl.formatMessage(messages['ecommerce.order.history.table.column.items']),
              key: 'description',
            },
            {
              label: this.props.intl.formatMessage(messages['ecommerce.order.history.table.column.date.placed']),
              key: 'datePlaced',
            },
            {
              label: this.props.intl.formatMessage(messages['ecommerce.order.history.table.column.total.cost']),
              key: 'total',
            },
            {
              label: this.props.intl.formatMessage(messages['ecommerce.order.history.table.column.order.number']),
              key: 'orderId',
            },
            {
              label: '',
              key: 'receiptUrl',
            },
          ]}
        />
        {this.renderPagination()}
      </React.Fragment>
    );
  }

  renderEmptyMessage() {
    return (
      <p>
        {this.props.intl.formatMessage(messages['ecommerce.order.history.no.orders'])}
      </p>
    );
  }

  renderError() {
    return (
      <div>
        {this.props.intl.formatMessage(messages['ecommerce.order.history.loading.error'], {
          error: this.props.loadingError,
        })}
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">
          {this.props.intl.formatMessage(messages['ecommerce.order.history.loading.orders'])}
        </span>
      </div>
    );
  }

  render() {
    const {
      loading,
      loadingError,
      orders,
    } = this.props;
    const loaded = !loading;
    return (
      <div className="page__order-history container-fluid py-5">
        <h1>
          {this.props.intl.formatMessage(messages['ecommerce.order.history.page.heading'])}
        </h1>
        {loadingError ? this.renderError() : null}
        {loaded && orders.length > 0 ? this.renderOrdersTable() : null}
        {loaded && orders.length === 0 ? this.renderEmptyMessage() : null}
        {loading ? this.renderLoading() : null}
      </div>
    );
  }
}


OrderHistoryPage.propTypes = {
  intl: intlShape.isRequired,
  orders: PropTypes.arrayOf(PropTypes.shape({
    datePlaced: PropTypes.string,
    total: PropTypes.string,
    orderId: PropTypes.string,
    receiptUrl: PropTypes.string,
    currency: PropTypes.string,
    lineItems: PropTypes.arrayOf(PropTypes.shape({
      itemId: PropTypes.number,
      title: PropTypes.string,
      quantity: PropTypes.number,
      description: PropTypes.string,
    })),
  })),
  pageCount: PropTypes.number,
  currentPage: PropTypes.number,
  loading: PropTypes.bool,
  loadingError: PropTypes.string,
  fetchOrders: PropTypes.func.isRequired,
};

OrderHistoryPage.defaultProps = {
  orders: [],
  loadingError: null,
  loading: false,
  pageCount: 0,
  currentPage: null,
};


export default connect(pageSelector, {
  fetchOrders,
})(injectIntl(OrderHistoryPage));
