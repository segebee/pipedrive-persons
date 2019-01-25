/**
 * @author Segun
 * @email segebee@gmail.com
 * @create date 2018-11-30
 * @modify date 2018-11-30
 */

// show the previous page of results
export const prevPage = function() {
  let { start, limit } = this.state;
  // do not proceed if current start is 0
  if (start === 0) return false;
  //decrease the current start by subtracting the current limit
  start = start - limit;
  const currentPage = start / limit + 1;
  this.setState({
    start,
    currentPage
  });
};

// show the next page of results
export const nextPage = function(totalrecords) {
  let { start, limit } = this.state;
  // do not proceed if current start added to the current limit would surpass the length of total records
  if (start + limit > totalrecords.length) return false;
  //increase the current start by adding the current limit
  start = start + limit;
  const currentPage = start / limit + 1;
  this.setState({
    start,
    currentPage
  });
};

// show the first page of results
export const firstPage = function() {
  //update the start param to 0 so it fetches result from the first record
  this.setState({ start: 0, currentPage: 1 });
};

// show the last page of results
export const lastPage = function(numberOfPages, limit) {
  if (!Number.isInteger(numberOfPages)) return false;
  //update the offset to switch pages
  this.setState({
    start: (numberOfPages - 1) * limit,
    currentPage: numberOfPages
  });
};

// function to handle the switching of pages when user clicks on a page number
export const switchPage = function(currentPage, limit) {
  // console.log({ currentPage, limit });
  if (!Number.isInteger(currentPage)) return false;
  //update the currentPage param to switch pages and start to fetch records from starting from start using the limit in state
  const start = (currentPage - 1) * limit;
  this.setState({ start, currentPage });
};
