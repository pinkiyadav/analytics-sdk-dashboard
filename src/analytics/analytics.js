
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

function getVisitorId() {
  let visitorId = localStorage.getItem('analytics_visitor_id')

  if (!visitorId) {
    visitorId = crypto.randomUUID()
    localStorage.setItem('analytics_visitor_id', visitorId)
  }

  return visitorId
}

function getSessionId() {
  let sessionId = sessionStorage.getItem('analytics_session_id')

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem('analytics_session_id', sessionId)
  }

  return sessionId
}

export function trackEvent(eventName, properties = {}) {
  const event = {
    event_name: eventName,
    visitor_id: getVisitorId(),
    session_id: getSessionId(),
    page_url: window.location.pathname,
    properties,
    occurred_at: new Date().toISOString(),
  }

  // Display the event while developing the SDK.
  console.log('[Analytics SDK]', event)

  // Send events to Laravel when the API URL is configured.
  if (API_BASE_URL) {
    fetch(`${API_BASE_URL}/analytics/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(event),
    }).catch((error) => {
      console.error('Analytics event could not be sent:', error)
    })
  }

  return event
}

export function trackPageView() {
  return trackEvent('page_view', {
    title: document.title,
    referrer: document.referrer,
  })
}
