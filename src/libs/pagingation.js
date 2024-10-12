module.exports = async (current_page, limit, Model, query) => {

    const totalRows  = await Model.find(query).countDocuments();
    const totalPages = Math.ceil(totalRows / limit);    
    const next       = current_page + 1;
    const prev       = current_page - 1;
    const hasNext    = (current_page >= totalPages) ? false : true;
    const hasPrev    = (current_page <= 1) ? false : true;

    return {
        totalRows,
        totalPages,
        next,
        prev,
        hasNext,
        hasPrev
    }
}