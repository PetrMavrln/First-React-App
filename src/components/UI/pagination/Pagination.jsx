import { getPagesArray } from 'components/utils/pages';
import React from 'react';

const Pagination = ({totalPages, page, changePage}) => {
    let pagesArray = getPagesArray(totalPages);
    return (
        <div className="page__wrapper">
        {pagesArray.map(p =>
          <span 
            onClick={() => changePage(p)}
            key={p} className={page === p ? 'page page__current' : 'page'}>
            {p}
          </span>
        )}
      </div>
    );
};

export default Pagination;