class Pager {
  constructor() {}

  pagination(totalCount = 0, page = 1, size = 6, showPageSize = 10) {
    const totalPages = Math.ceil(totalCount / size);
    const startPage = Math.max(1, Math.floor((page - 1) / showPageSize) * showPageSize + 1);
    const endPage = Math.min(totalPages, startPage + showPageSize - 1);

    const prevPages = [];
    for (let i = startPage; i < page; i++) {
      prevPages.push(i);
    }

    const nextPages = [];
    for (let i = page + 1; i <= endPage; i++) {
      nextPages.push(i);
    }
  
    return {
      page,
      size,
      totalCount,
      lastPageNo: totalPages,
      prevPages,
      nextPages,
      showPageSize,
      startPage,
      endPage
    };
  }

  bind(pagerWrapperEl, page, size, totalCount, callback) {
    // 기존 페이징 제거
    const existingPaging = pagerWrapperEl.querySelector("div.paging10");
    if (existingPaging) {
      existingPaging.remove();
    }

    const paged = this.pagination(totalCount, page, size);

    const divPaging = document.createElement("div");
    pagerWrapperEl.appendChild(divPaging);
    divPaging.classList.add("paging10");

    const createPageItem = (page, label, additionalClasses = [], isClickable = true) => {
      const a = document.createElement("a");
      a.href = "javascript:";
      a.dataset.page = page;
      a.classList.add("pageNum10", ...additionalClasses);
      a.textContent = label;
      if (isClickable) {
        a.onclick = () => callback(page);
      }
      return a;
    };

    // 이전 페이지 버튼
    if (page > paged.showPageSize) {
      const prevBtn = createPageItem(paged.startPage - 1, "이전페이지", ["pageBtn10", "prev10"]);
      prevBtn.innerHTML = '<span class="hidText10">이전페이지</span>';
      divPaging.appendChild(prevBtn);
    }

    // 이전 페이지 목록
    const prevPages = paged.prevPages;
    prevPages.forEach((i) => {
      divPaging.appendChild(createPageItem(i, i.toString()));
    });

    // 현재 페이지
    divPaging.appendChild(createPageItem(paged.page, paged.page.toString(), ["active10"], false));

    // 다음 페이지 목록
    const nextPages = paged.nextPages;
    nextPages.forEach((i) => {
      divPaging.appendChild(createPageItem(i, i.toString()));
    });

    // 다음 페이지 버튼
    if (paged.lastPageNo > paged.endPage) {
      const nextBtn = createPageItem(paged.endPage + 1, "다음페이지", ["pageBtn10", "next10"]);
      nextBtn.innerHTML = '<span class="hidText10">다음페이지</span>';
      divPaging.appendChild(nextBtn);
    }
  }
}
