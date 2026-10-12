import React from 'react';

// Last line of defence: a render error in one section must not blank the whole app.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('UI error:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-forest-50">
        <div className="max-w-md bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
          <h1 className="text-lg font-bold text-forest-850">कुछ गलत हो गया / Something went wrong</h1>
          <p className="text-sm text-gray-600 mt-2">
            पेज को फिर से लोड करें। आपका सहेजा हुआ डेटा सुरक्षित है। / Please reload the page. Your saved data is safe.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 bg-forest-900 hover:bg-forest-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl"
          >
            Reload / फिर से लोड करें
          </button>
        </div>
      </div>
    );
  }
}
