exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ? 
                        'mongodb://entity-sentiment-analysis:TestDB9787@ds111549.mlab.com:11549/entities-app':
                      'mongodb://localhost/entities-app');
exports.PORT = process.env.PORT || 8080;