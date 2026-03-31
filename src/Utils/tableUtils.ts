export const getSrNo = (page: number, pageSize: number | 'All', index: number): number => {
    if (pageSize === 'All') return index + 1;
    return (page - 1) * pageSize + index + 1;
};
