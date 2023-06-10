const handlebar = {
    convertToDate: (date) => {
        const result = new Date(date);
        return result.toLocaleString();
    },
};
module.exports = handlebar;
