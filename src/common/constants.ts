export const BULL_QUEUE_QUEUES = {
  PRODUCTS: {
    NAME: 'products',
    JOBS: {
      HANDLE_CSV_PRODUCT: 'handle-csv-product',
    },
    OPTIONS: {
      removeOnComplete: true,
      removeOnFail: true,
    },
  },
};

export const MONGO_COLLECTIONS = {
  PRODUCTS: 'products',
  PRODUCTS_VARIANTS: 'product_variants',
};
