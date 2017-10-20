import createHistory from 'history/createBrowserHistory';

const history = typeof window !== 'undefined' ? createHistory() : null;

export default history;
