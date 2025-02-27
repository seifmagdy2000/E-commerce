export const paginate = async (model, page = 1, limit = 10, filter = {}) => {
  const skip = (page - 1) * limit;
  const totalCount = await model.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / limit);

  const data = await model.find(filter).skip(skip).limit(limit).lean();

  return {
    data,
    currentPage: page,
    totalPages,
    totalItems: totalCount,
    perPage: limit,
  };
};
