module.exports = {
  endpoints: {
    data: {
      protocol: 'https',
      host: 'data.gosquared.com',
      port: 443,
      method: 'GET'
    },

    api: {
      protocol: 'https',
      host: 'api.gosquared.com',
      port: 443,
      method: 'GET'
    }
  },

  gsEvent: {
    route: '/event'
  },

  api: {
    functions: [
      "aggregateStats",
      "alertPreferences",
      "campaigns",
      "concurrents",
      "engagement",
      "events",
      "expandUrl",
      "fullDump",
      "functions",
      "geo",
      "ignoredVisitors",
      "notifications",
      "organics",
      "overview",
      "pages",
      "referrers",
      "reportPreferences",
      "sites",
      "time",
      "timeSeries",
      "trends",
      "visitors"
      ]
  }
};