module.exports = {
  endpoints: {
    data: {
      protocol: 'https',
      host: 'data.gosquared.com',
      port: 443,
      method: 'POST'
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
      "campaigns",
      "concurrents",
      "engagement",
      "functions",
      "geo",
      "ignoredVisitors",
      "organics",
      "overview",
      "pages",
      "referrers",
      "reportPreferences",
      "sites",
      "time",
      "timeSeries",
      "visitors"
      ]
  }
};