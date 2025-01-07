class Menu {
  constructor() {
    this.menuDtos = [{"menuId":"acaf484edd10","menuNm":"탑메뉴1","menuCn":"","ordrVl":0,"upMenuId":"-","prjId":"e18ac518df06","scrnId":"ddfca83c088a","wrtrId":"","wrtDt":null,"mdfrId":"","mdfcnDt":null},{"menuId":"d7983df8db89","menuNm":"구매상품 목록","menuCn":"","ordrVl":0,"upMenuId":"cea528cd0b2a","prjId":"e18ac518df06","scrnId":"f94b8a9b7919","wrtrId":"","wrtDt":null,"mdfrId":"","mdfcnDt":null},{"menuId":"e79030c320b5","menuNm":"구매상품 등록","menuCn":"","ordrVl":0,"upMenuId":"acaf484edd10","prjId":"e18ac518df06","scrnId":"ddfca83c088a","wrtrId":"","wrtDt":null,"mdfrId":"","mdfcnDt":null},{"menuId":"cea528cd0b2a","menuNm":"탑메뉴2","menuCn":"","ordrVl":1,"upMenuId":"-","prjId":"e18ac518df06","scrnId":"f94b8a9b7919","wrtrId":"","wrtDt":null,"mdfrId":"","mdfcnDt":null}] ?? [];
  }

  getMainMenus() {
    return this.menuDtos.filter((dto) => dto.upMenuId === "-");
  }

  getSubMenus(upMenuId) {
    return this.menuDtos.filter((dto) => dto.upMenuId === upMenuId);
  }
  findMenuNameByUpMenuId(upMenuId) {
    const menu = this.menuDtos.find((dto) => dto.menuId === upMenuId);
    return menu ? menu.menuNm : null;
  }
  mainLogoClicked() {
    const aEl = document.getElementById("main-logo");
    aEl.addEventListener("click", () => {
      window.location.href = 'index.html';
    });
  }
  createGnbMenu(el) {
    const ulEl = document.createElement("ul");
    ulEl.id = "tm10";
    el.appendChild(ulEl);

    this.getMainMenus().forEach((dto) => {
      const liEl = document.createElement("li");
      liEl.classList.add("th10");
      ulEl.appendChild(liEl);

      const aEl = document.createElement("a");
      liEl.appendChild(aEl);
      aEl.textContent = dto.menuNm;
      aEl.href = "javascript:void(0);";

      let scrnId = dto.scrnId ?? "";
      if (!scrnId) {
        const childMenus = this.getSubMenus(dto.menuId).sort((a, b) => a.ordrVl - b.ordrVl);
        if (childMenus.length > 0) {
          scrnId = childMenus[0].scrnId;
        } else {
          scrnId = "";
        }
      }

      aEl.addEventListener("click", () => {
        if (scrnId !== "") {
          this.setMenuInfoToLocalStorage(dto.menuId, dto.upMenuId);
          customObj.goPage(scrnId);
        }
      });

      this.createGnbSubMenu(liEl, dto.menuId);
    });
  }

  createGnbSubMenu(el, menuId) {
    const subMenus = this.getSubMenus(menuId);
    if (subMenus.length > 0) {
      const ulEl = document.createElement("ul");
      ulEl.classList.add("gnb_depth10");
      ulEl.style.display = "none";
      ulEl.style.height = "auto";
      el.appendChild(ulEl);

      subMenus.forEach((dto) => {
        const liEl = document.createElement("li");
        ulEl.appendChild(liEl);

        const aEl = document.createElement("a");
        liEl.appendChild(aEl);
        aEl.textContent = dto.menuNm;
        aEl.href = "javascript:void(0);";
        aEl.addEventListener("click", () => {
          const scrnId = dto.scrnId;
          if (scrnId !== "") {
            this.setMenuInfoToLocalStorage(dto.menuId, dto.upMenuId);
            customObj.goPage(scrnId);
          } else {
            alert("화면과 메뉴를 연결하지 않았습니다.");
          }
        });

        this.createGnbSubMenu(liEl, dto.menuId);
      });
    }
  }

  createResponsiveMenu() {
    const mainMenu = document.getElementById("responsive-menu");

    this.getMainMenus().forEach((dto) => {
      const liEl = document.createElement("li");
      const aEl = document.createElement("a");
      const divEl = document.createElement("div");

      aEl.classList.add("dep1-link10");
      divEl.classList.add("dep10");

      aEl.append(dto.menuNm);
      aEl.href = "javascript:void(0);";
      aEl.dataset.sc = dto.scrnId;
      aEl.dataset.mn = dto.menuId;
      aEl.dataset.umn = dto.upMenuId;

      liEl.appendChild(aEl);
      liEl.appendChild(divEl);
      mainMenu.appendChild(liEl);

      // 서브메뉴가 있을 경우 추가
      const subMenus = this.getSubMenus(dto.menuId);
      if (subMenus.length > 0) {
        this.createResponsiveSubMenu(divEl, dto.menuId);
      }

      // 클릭 이벤트 추가 (slideToggle 대체)
      aEl.addEventListener("click", function (e) {
        e.preventDefault();

        // divEl의 display 상태를 토글
        if (divEl.style.display === "block") {
          divEl.style.display = "none"; // 닫기
          aEl.classList.remove("active");
        } else {
          divEl.style.display = "block"; // 열기
          aEl.classList.add("active");
        }
      });
    });
  }

  createResponsiveSubMenu(parentEl, menuId) {
    const ulEl = document.createElement("ul");
    parentEl.appendChild(ulEl);

    const subMenuData = this.getSubMenus(menuId);
    subMenuData.forEach((dto) => {
      const liEl = document.createElement("li");
      const aEl = document.createElement("a");
      aEl.textContent = "· " + dto.menuNm;
      aEl.href = "javascript:void(0);";
      aEl.addEventListener("click", (event) => {
        event.preventDefault();

        const scrnId = dto.scrnId;
        if (scrnId !== "") {
          this.setMenuInfoToLocalStorage(dto.menuId, dto.upMenuId);
          customObj.goPage(scrnId);
        } else {
          alert("화면과 메뉴를 연결하지 않았습니다.");
        }
      });

      liEl.appendChild(aEl);
      ulEl.appendChild(liEl);

      // 하위 메뉴가 있다면 재귀 호출
      const subSubMenus = this.getSubMenus(dto.menuId);
      if (subSubMenus.length > 0) {
        this.createResponsiveSubMenu(liEl, dto.menuId);
      }
    });
  }

  createLnbMenu() {
    const lnbMenu = document.getElementById("lnb-menu");
    const lnbList = document.querySelector(".lnb-list1010 ul");
    lnbList.innerHTML = ""; // 기존 메뉴 초기화
    // 생성될 메뉴 데이터 가져오기
    const menuInfo = this.getStoredMenuInfo();

    // 기본 메뉴 정보 설정
    if (menuInfo.menuId) {
      menuInfo.upMenuId = menuInfo.upMenuId === "-" ? menuInfo.menuId : menuInfo.upMenuId;
    } else {
      this.setDefaultUpMenuId(menuInfo);
    }

    // h3 요소에 상위 메뉴명 설정
    lnbMenu.innerText = this.findMenuNameByUpMenuId(menuInfo.upMenuId) || "";

    // 하위 메뉴 목록을 받아와 생성
    const subSubMenus = this.getSubMenus(menuInfo.upMenuId);
    subSubMenus.forEach((dto) => {
      const liEl = document.createElement("li");
      const aEl = document.createElement("a");
      aEl.href = "javascript:void(0);";
      aEl.textContent = dto.menuNm;
      if (dto.menuId === menuInfo.menuId) {
        liEl.classList.add("on"); // 현재 선택된 메뉴에 스타일 클래스 추가
      }
      // 클릭 시 이벤트 핸들러 설정
      aEl.addEventListener("click", () => {
        const scrnId = dto.scrnId;
        if (scrnId !== "") {
          this.setMenuInfoToLocalStorage(dto.menuId, dto.upMenuId);
          customObj.goPage(scrnId);
        } else {
          alert("화면과 메뉴를 연결하지 않았습니다.");
        }
      });
      liEl.appendChild(aEl);
      lnbList.appendChild(liEl);
    });
  }

  getStoredMenuInfo() {
    const menuItem = localStorage.getItem("menuGroup");
    return menuItem ? JSON.parse(menuItem) : {};
  }

  setMenuInfoToLocalStorage(menuId, upMenuId) {
    const menuInfo = {
      menuId: menuId,
      upMenuId: upMenuId,
    };
    localStorage.setItem("menuGroup", JSON.stringify(menuInfo));
  }

  setDefaultUpMenuId(menuInfo) {
    const firstMenuDto = this.menuDtos
      .filter((dto) => dto.scrnId === menuInfo.screnId)
      .reduce((minDto, currentDto) => {
        return currentDto.ordrVl < minDto.ordrVl ? currentDto : minDto;
      }, {});

    if (firstMenuDto.upMenuId !== "-") {
      menuInfo.upMenuId = firstMenuDto.upMenuId;
    }
  }
}
