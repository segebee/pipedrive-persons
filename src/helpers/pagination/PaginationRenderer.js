/**
 * @author Segun
 * @email segebee@gmail.com
 * @create date 2018-11-30
 * @modify date 2018-11-30
 */

import React from "react";
import { Icon, Menu } from "semantic-ui-react";
import PropTypes from "prop-types";

const styles = {
  paginationSummary: {
    display: "inline-block",
    lineHeight: 1,
    fontSize: 16
  },
  selectorContainer: {
    display: "inline-block",
    marginRight: 10,
    paddingRight: 10,
    marginTop: 10,
    fontSize: 16,
    borderRight: "1px solid #000"
  }
};

// generate a range of numbers
const range = (start, end) =>
  Array.from(Array(end - start + 1).keys()).map(i => i + start);

// generate a random number
const getRandomNumber = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

// get pages to display
const getPages = (
  pageCount,
  currentPage,
  isMobile,
  separator,
  numberOfPages
) => {
  // generate an array of page numbers based on the numberOfPages if numberOfPages does not exceed maxPages
  if (numberOfPages <= pageCount)
    return Array.from(new Array(numberOfPages), (value, index) => index + 1);
  /* 
   generate an array of page numbers based on the numberOfPages if numberOfPages exceeds pageCount.
   it shows a few of the first and last sets of pages separated by a divider, which is dependent on the 
   pageCount(how many pages we want to show)
   */
  // get number of pages to show on the left and right of a divider (eg ...)
  const eachSidePages = Math.ceil(pageCount / 2);
  // generate left side pages
  // set default start page number for left side of the divider
  let leftSidePageNumbersMin = 1;
  // set default max page number for left side of the divider
  let leftSidePageNumbersMax = eachSidePages;
  // set minimum page number on the right to the difference of the number of pages and the expected number of pages on both sides of the divider. add 1 to make the minimum page number exclusive
  const rightSidePageNumbersMin = numberOfPages - eachSidePages + 1;
  // set right pagenumber max to the number of pages
  const rightSidePageNumbersMax = numberOfPages;

  /* if current page number plus the minimum no of pages to be shown to the right of the current page before the divider is greater than the max page number on the left side and less than or equal to the min number on the right side... dynamically set the min and max page numbers for the left side */

  // set minimum no of pages to be shown between current page and next page
  const currentPageNumberGutter = 1;
  // set a new page number max if the left min and max aint equal
  let newLeftSidePageNumbersMax =
    eachSidePages === 1 ? currentPage : currentPage + currentPageNumberGutter;

  if (
    newLeftSidePageNumbersMax > leftSidePageNumbersMax &&
    newLeftSidePageNumbersMax <= rightSidePageNumbersMin
  ) {
    leftSidePageNumbersMax = newLeftSidePageNumbersMax;
    // set left side max page number based on right side min page number
    if (newLeftSidePageNumbersMax === rightSidePageNumbersMin) {
      leftSidePageNumbersMax = newLeftSidePageNumbersMax - 1;
      leftSidePageNumbersMin =
        leftSidePageNumbersMax - (eachSidePages - currentPageNumberGutter);
    } else {
      leftSidePageNumbersMin =
        eachSidePages === 1
          ? currentPage
          : newLeftSidePageNumbersMax -
            (eachSidePages - currentPageNumberGutter);
    }
  }
  // generate left side pages
  const leftSidePages = range(leftSidePageNumbersMin, leftSidePageNumbersMax);
  //generate right side pages
  const rightSidePages = range(
    rightSidePageNumbersMin,
    rightSidePageNumbersMax
  );
  // if user isn't on mobile, display full range of page numbers
  if (isMobile === false) {
    // merge the left and right page numbers using a separator, if its just one page, the return an array with 1 as the only element
    return pageCount === 1
      ? [currentPage]
      : leftSidePages.concat([separator], rightSidePages);
  } else {
    return [currentPage];
  }
};

// render limit selector
const renderLimitSelector = (
  limit,
  totalrecords,
  recordIdentifier,
  handleLimitChange
) => {
  return (
    <div
      id="limit-selector-container"
      align="left"
      style={styles.selectorContainer}
    >
      Show
      <select
        className="limit-selector"
        onChange={handleLimitChange}
        value={limit}
      >
        <option>5</option>
        <option>10</option>
        <option>15</option>
        <option>20</option>
        <option value={totalrecords}>All</option>
      </select>
      <span className="recordtype">{recordIdentifier}</span>
    </div>
  );
};

// render pagination info
const renderPaginationInformation = (
  start,
  limit,
  totalrecords,
  recordIdentifier
) => {
  //show user the pagination summary
  let end = start + limit > totalrecords ? totalrecords : start + limit;
  const paginationInformation = `Showing ${start +
    1} to ${end} of ${totalrecords} ${recordIdentifier}`;

  return (
    <div id="pagination-summary" style={styles.paginationSummary}>
      {paginationInformation}
    </div>
  );
};

// render page numbers
const renderPageNumbers = (pages, currentPage, switchPage, limit) => {
  return pages.map((page, index) => {
    const key = page + "" + getRandomNumber(999);
    return (
      <Menu.Item
        active={page === currentPage}
        onClick={() => switchPage(page, limit)}
        key={key}
        as="a"
      >
        {page}
      </Menu.Item>
    );
  });
};

// generate pagination
const generatePagination = (
  currentPage = null,
  pages,
  switchPage,
  limit,
  disablePrev,
  firstPage,
  prevPage,
  disableNext,
  nextPage,
  totalrecords,
  lastPage,
  numberOfPages
) => {
  //loop through pageNumbers and generate links to pages. When clicked, increase start by current page number in state
  return (
    <Menu floated="right" pagination>
      <Menu.Item
        as="a"
        icon
        disabled={disablePrev}
        onClick={() => firstPage(limit)}
      >
        <Icon name="angle double left" />
      </Menu.Item>

      <Menu.Item as="a" icon disabled={disablePrev} onClick={prevPage}>
        <Icon name="left chevron" />
      </Menu.Item>

      {renderPageNumbers(pages, currentPage, switchPage, limit)}

      <Menu.Item
        as="a"
        disabled={disableNext}
        icon
        onClick={() => nextPage(totalrecords)}
      >
        <Icon name="right chevron" />
      </Menu.Item>

      <Menu.Item
        as="a"
        disabled={disableNext}
        icon
        onClick={() => lastPage(numberOfPages, limit)}
      >
        <Icon name="angle double right" />
      </Menu.Item>
    </Menu>
  );
};

// build the footer pagination
const PaginationRenderer = props => {
  const {
    start,
    limit,
    prevPage,
    nextPage,
    switchPage,
    isMobile,
    firstPage,
    lastPage,
    currentPage,
    pageCount,
    totalrecords,
    recordType,
    recordTypeSingular,
    handleLimitChange,
    separator
  } = props;

  //show empty div if no records present
  if (totalrecords < 1) return <div />;
  //disable next if we have reached last page
  let disableNext = start + limit >= totalrecords;
  //disable prev if we are on first page
  let disablePrev = start === 0;
  //get number of pages to be shown
  let numberOfPages = totalrecords > 0 ? Math.ceil(totalrecords / limit) : 1;
  let pages = [];
  // get pages to be shown
  pages = getPages(pageCount, currentPage, isMobile, separator, numberOfPages);
  // set record identifier
  const recordIdentifier = totalrecords > 1 ? recordType : recordTypeSingular;

  return (
    <div id="pagination">
      {renderLimitSelector(
        limit,
        totalrecords,
        recordIdentifier,
        handleLimitChange
      )}

      {renderPaginationInformation(
        start,
        limit,
        totalrecords,
        recordType,
        recordTypeSingular,
        recordIdentifier
      )}

      {generatePagination(
        currentPage,
        pages,
        switchPage,
        limit,
        disablePrev,
        firstPage,
        prevPage,
        disableNext,
        nextPage,
        totalrecords,
        lastPage,
        numberOfPages
      )}
    </div>
  );
};

PaginationRenderer.defaultProps = {
  currentPage: 1
};

PaginationRenderer.propTypes = {
  currentPage: PropTypes.number.isRequired
};

export default PaginationRenderer;
