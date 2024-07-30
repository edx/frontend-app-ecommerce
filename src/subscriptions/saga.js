import { put, takeLatest, call } from 'redux-saga/effects';

import { fetchSubscriptions, hideSubscriptionSection } from './actions';
import getSubscriptions from './service';

function* handleFetchSubscriptions() {
  try {
    yield put(fetchSubscriptions.request());
    const result = yield call(getSubscriptions);
    if (!result?.length) {
      yield put(hideSubscriptionSection());
    }
    yield put(fetchSubscriptions.success(result));
  } catch (error) {
    /**
    * TODO: PON-299 - Remove the extra condition after the MVP.
    */
    if (error?.response?.status === 401 && error?.response?.data?.error_code === 'unauthorized_user') {
      yield put(hideSubscriptionSection());
    } else {
      yield put(fetchSubscriptions.failure(error));
    }
  } finally {
    yield put(fetchSubscriptions.fulfill());
  }
}

export default function* subscriptionSaga() {
  yield takeLatest(fetchSubscriptions.TRIGGER, handleFetchSubscriptions);
}
