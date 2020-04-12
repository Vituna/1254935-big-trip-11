const filterNames = [
  `Everything`, `Future`, `Past`
];

const generateFilters = () => {
  return filterNames.map((it) => {
    return {
      name: it,
    };
  });
};

export {generateFilters};

