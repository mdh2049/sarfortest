class Custom {
    constructor() {
        this.scrnDtos = [];
        this.currentScrnDto = {};
        this.requestPath = "";
        this.menuDtos = [{"menuId":"acaf484edd10","menuNm":"탑메뉴1","menuCn":"","ordrVl":0,"upMenuId":"-","prjId":"e18ac518df06","scrnId":"ddfca83c088a","wrtrId":"","wrtDt":null,"mdfrId":"","mdfcnDt":null},{"menuId":"d7983df8db89","menuNm":"구매상품 목록","menuCn":"","ordrVl":0,"upMenuId":"cea528cd0b2a","prjId":"e18ac518df06","scrnId":"f94b8a9b7919","wrtrId":"","wrtDt":null,"mdfrId":"","mdfcnDt":null},{"menuId":"e79030c320b5","menuNm":"구매상품 등록","menuCn":"","ordrVl":0,"upMenuId":"acaf484edd10","prjId":"e18ac518df06","scrnId":"ddfca83c088a","wrtrId":"","wrtDt":null,"mdfrId":"","mdfcnDt":null},{"menuId":"cea528cd0b2a","menuNm":"탑메뉴2","menuCn":"","ordrVl":1,"upMenuId":"-","prjId":"e18ac518df06","scrnId":"f94b8a9b7919","wrtrId":"","wrtDt":null,"mdfrId":"","mdfcnDt":null}] ?? [];
    }

    setReadonlyMode() {
        document.querySelectorAll(".contentinner3 > input, .contentinner3 > textarea").forEach((el) => (el.readOnly = true));
        document.querySelectorAll(".contentinner3 select").forEach((el) => (el.disabled = true));
        document.querySelectorAll(".contentinner3 input[type='radio']").forEach((el) => (el.disabled = true));
        document.querySelectorAll(".contentinner3 input[type='checkbox']").forEach((el) => (el.disabled = true));
    }

    /**
    * 파일 업로드(동기처리)
    * @param fileList
    * @param atchmnflGroupId 첨부파일 그룹 아이디.
    */
    async uploadFileSync(fileList, atchmnflGroupId = "") {
        if (fileList === null) {
            return atchmnflGroupId;
        }

        if (fileList.length === 0) {
            return atchmnflGroupId;
        }

        const fd = new FormData();
        for (let file of fileList) {
            fd.append("mfiles", file);
        }

        const url = API_URL + "/atchmnfls/file?atchmnflGroupId=" + (Utils.isNotNull(atchmnflGroupId) ? atchmnflGroupId : "");
        const res = await fetch(url, {
            method: "POST",
            body: fd,
        });

        if (res.status !== 200) {
            throw new Error("파일 업로드 중 오류가 발생했습니다.");
        }

        const resultMap = await res.json();
        return resultMap.data[0].atchmnflGroupId;
    }

    async getAtchmnflsByAtchmnflGroupId(atchmnflGroupId) {
        if (atchmnflGroupId === null || atchmnflGroupId === undefined) {
            return [];
        }

        const res = await fetch(`${API_URL}/atchmnfls/parent/${atchmnflGroupId}/children`);
        const resultMap = await res.json();
        return resultMap.data;
    }

    /**
    * 파일 el 처리 로직
    */
    async getAndBindDataByPkValue(pkValue, scrnType) {
        const _bindAtchmnfls = (divRowEl, atchmnflDtos) => {
            atchmnflDtos.forEach((atchmnflDto) => {
                divRowEl.style.width = "850px";
                divRowEl.style.fontSize = "11px";

                //파일명 div 생성
                const divCol1El = document.createElement("div");
                divRowEl.appendChild(divCol1El);
                divCol1El.classList.add("mb-2");
                divCol1El.innerText =
                atchmnflDto.originalFilename +" | " +Math.round(atchmnflDto.fileSize / 1024) + "KB | ";

                //다운로드 링크 생성
                const aEl = document.createElement("a");
                divCol1El.appendChild(aEl);
                aEl.innerText = "다운로드";
                aEl.style.textDecoration = "underline";
                aEl.style.cursor = "pointer";
                aEl.href = `${API_URL}/atchmnfls/${atchmnflDto.atchmnflId}/file`;
                aEl.setAttribute("download", atchmnflDto.originalFilename);

                //이미지 파일인 경우 미리보기 생성
                if (divRowEl.previousSibling.classList[0] === "imgFile") {
                    const imageUrl = `${API_URL}/atchmnfls/${atchmnflDto.atchmnflId}/file`;
                    const previewEl = this.createImgPreview(imageUrl);
                    previewEl.style.display='block'
                    divRowEl.appendChild(previewEl);
                }
            });
        };

        const res = await fetch(API_URL + `/${this.requestPath}/` + pkValue);
        const resultMap = await res.json();

        const data = resultMap.data;
        Object.keys(data).forEach(async (dtoFieldName) => {
            let dataStorageColumnId = Utils.camelToSnake(dtoFieldName);

            const els = document.querySelectorAll(`[data-data-storage-column-id="${dataStorageColumnId}"]`);
            if (els === null || els.length === 0) {
                return;
            }

            if (els.length === 1) {
                const el = els[0];
                if (el.getAttribute("type") === "file") {
                    const atchmnflGroupId = data[dtoFieldName] ?? "";
                    el.dataset.atchmnflGroupId = atchmnflGroupId;

                    if (scrnType === "R") {
                        el.classList.add("d-none");

                        const wrapperEl = el.parentElement;

                        const divEl = document.createElement("div");
                        wrapperEl.appendChild(divEl);
                        divEl.classList.add("row");
                        divEl.style.width = "100%";
                        divEl.style.height = "100%";

                        //  파일 목록 표시
                        const atchmnflDtos = await this.getAtchmnflsByAtchmnflGroupId(atchmnflGroupId);
                        _bindAtchmnfls(divEl, atchmnflDtos);
                    }

                    return;
                }

                el.value = data[dtoFieldName];
            }

            if (els.length > 1) {
                els.forEach((el) => {
                    if (el.getAttribute("type") === "checkbox") {
                        const b = (data[dtoFieldName] ?? "").split(DELI_PIPE).includes(el.value);
                        if (b) {
                            el.checked = true;
                        }
                    }

                    if (el.getAttribute("type") === "radio") {
                        el.checked = el.value === data[dtoFieldName];
                    }
                });
            }
        });
    }

    createPagerWrapperEl(contentinner3El) {
        const tableEl = document.querySelector('table.table');
        if (!tableEl) {
            return;
        }

        const tableWrapperEl = tableEl.parentElement;
        if (!tableWrapperEl) {
            return;
        }

        tableWrapperEl.style.overflow = 'auto';

        const tbodyEl = tableWrapperEl.querySelector('tbody');
        if (tbodyEl) {
            tbodyEl.style.whiteSpace = 'nowrap';
        }

        const divEl = document.createElement('div');
        divEl.dataset.pager = 'true';
        divEl.classList.add('paginBox10');
        contentinner3El.appendChild(divEl);

        return divEl;
    }

    async processCButton(cButtonEl) {
        if (cButtonEl === null) {
            return;
        }

        cButtonEl.addEventListener("click", async (e) => {
            const formEl = document.getElementById("form");
            const json = {};

            const els = formEl.querySelectorAll("input, select, textarea");
            for (let i = 0; i < els.length; i++) {
                const el = els[i];

                const dataStorageColumnId = el.getAttribute("data-data-storage-column-id");
                if (dataStorageColumnId === null || dataStorageColumnId === undefined || dataStorageColumnId === "") {
                    continue;
                }

                const dtoPropertyName = Utils.snakeToCamel(dataStorageColumnId);

                //  type='file' 존재시 파일 업로드 처리
                if (el.getAttribute("type") === "file") {
                    const atchmnflGroupId = await this.uploadFileSync(el.files);
                    json[dtoPropertyName] = atchmnflGroupId;

                    continue;
                }

                // type='checkbox' 존재시 체크박스 처리
                if (el.getAttribute("type") === "checkbox") {
                    if (el.checked) {
                        json[dtoPropertyName] = json[dtoPropertyName] === undefined ? el.value : json[dtoPropertyName] + DELI_PIPE + el.value;
                    }

                    continue;
                }

                // radio
                if (el.getAttribute("type") === "radio") {
                    if (el.checked) {
                        json[dtoPropertyName] = el.value;
                    }

                    continue;
                }

                json[dtoPropertyName] = el.value;
            }

            if (!confirm("저장하시겠습니까?")) {
                return;
            }

            // fetch post 호출
            const res = await fetch(API_URL + `${this.requestPath}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(json),
            });

            if (res.status !== 200) {
                alert("오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                return;
            }

            const resultMap = await res.json();
            const nextScrenId = cButtonEl.getAttribute("data-next-scren-id");

            // /start - scrnId에 해당하는 메뉴정보 로컬스토리지에 재저장
            const filteredMenuDto  = this.menuDtos.filter(dto => dto.scrnId === nextScrenId);
            const menuInfo = {
                menuId: "",
                upMenuId: "",
                scrnId: ""
            };

            if (filteredMenuDto.length > 0) {
                const menuDto = filteredMenuDto[0];

                menuInfo.menuId = menuDto.menuId;
                menuInfo.upMenuId = menuDto.upMenuId;

                localStorage.setItem('menuGroup', JSON.stringify(menuInfo));
            }
            // /end

            if (nextScrenId !== "") {
                this.goPage(nextScrenId, { pkValue: resultMap.data });
            }
        });
    }

    processUButton(uButtonEl, dataStorageId, pkValue) {
        uButtonEl.addEventListener("click", async () => {
            const formEl = document.getElementById("form");
            const json = {};
            const pkFieldName = "pk" + Utils.capitalize(dataStorageId);
            json[pkFieldName] = pkValue;

            const els = formEl.querySelectorAll("input, select, textarea");
            for (let i = 0; i < els.length; i++) {
                const el = els[i];

                const dataStorageColumnId = el.getAttribute("data-data-storage-column-id");
                if (dataStorageColumnId === null || dataStorageColumnId === undefined || dataStorageColumnId === "") {
                    continue;
                }

                const dtoFieldName = Utils.snakeToCamel(dataStorageColumnId);

                //  type='file' 존재시 파일 업로드 처리
                if (el.getAttribute("type") === "file") {
                    let atchmnflGroupId = el.getAttribute("data-atchmnfl-group-id");
                    // ! 등록시에는 첨부파일 없음, 수정시에 첨부파일 있음이면 atchmnflGroupId값 변경됨
                    atchmnflGroupId = await this.uploadFileSync(el.files, atchmnflGroupId);
                    json[dtoFieldName] = atchmnflGroupId;

                    continue;
                }

                // type='checkbox' 존재시 체크박스 처리
                if (el.getAttribute("type") === "checkbox") {
                    if (el.checked) {
                        json[dtoFieldName] = json[dtoFieldName] === undefined ? el.value : json[dtoFieldName] + DELI_PIPE + el.value;
                    }

                    continue;
                }

                // radio
                if (el.getAttribute("type") === "radio") {
                    if (el.checked) {
                        json[dtoFieldName] = el.value;
                    }

                    continue;
                }

                json[dtoFieldName] = el.value;
            }

            if (!confirm("수정하시겠습니까?")) {
                return;
            }

            // fetch post 호출
            const res = await fetch(API_URL + `/${this.requestPath}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(json),
            });

            if (res.status !== 200) {
                alert("오류가 발생했습니다. 관리자에게 문의하시기 바랍니다.");
                return;
            }

            const nextScrenId = uButtonEl.getAttribute("data-next-scren-id");

            // /start - scrnId에 해당하는 메뉴정보 로컬스토리지에 재저장
            const filteredMenuDto  = this.menuDtos.filter(dto => dto.scrnId === nextScrenId);
            const menuInfo = {
                menuId: "",
                upMenuId: "",
                scrnId: ""
            };

            if (filteredMenuDto.length > 0) {
                const menuDto = filteredMenuDto[0];

                menuInfo.menuId = menuDto.menuId;
                menuInfo.upMenuId = menuDto.upMenuId;

                localStorage.setItem('menuGroup', JSON.stringify(menuInfo));
            }
            // /end

            if (nextScrenId !== "") {
                this.goPage(nextScrenId, { pkValue });
            }
        });
    }

    processDButton(dButtonEl, pkValue) {
        if (dButtonEl === null) {
            return;
        }

        dButtonEl.addEventListener("click", async (e) => {
            if (!confirm("삭제하시겠습니까?")) {
                return;
            }

            await fetch(API_URL + `/${this.requestPath}/` + pkValue, {
                method: "DELETE",
            });

            const nextScrenId = dButtonEl.getAttribute("data-next-scren-id");

            // /start - scrnId에 해당하는 메뉴정보 로컬스토리지에 재저장
            const filteredMenuDto  = this.menuDtos.filter(dto => dto.scrnId === nextScrenId);
            const menuInfo = {
                menuId: "",
                upMenuId: "",
                scrnId: ""
            };

            if (filteredMenuDto.length > 0) {
                const menuDto = filteredMenuDto[0];

                menuInfo.menuId = menuDto.menuId;
                menuInfo.upMenuId = menuDto.upMenuId;

                localStorage.setItem('menuGroup', JSON.stringify(menuInfo));
            }
            // /end

            if (nextScrenId !== "") {
                this.goPage(nextScrenId);
            }
        });
    }

    processLButton(lButtonEl, pkValue) {
        if (lButtonEl === null) {
            return;
        }

        lButtonEl.addEventListener("click", (e) => {
            const nextScrenId = lButtonEl.getAttribute("data-next-scren-id");

            // /start - scrnId에 해당하는 메뉴정보 로컬스토리지에 재저장
            const filteredMenuDto  = this.menuDtos.filter(dto => dto.scrnId === nextScrenId);
            const menuInfo = {
                menuId: "",
                upMenuId: "",
                scrnId: ""
            };

            if (filteredMenuDto.length > 0) {
                const menuDto = filteredMenuDto[0];

                menuInfo.menuId = menuDto.menuId;
                menuInfo.upMenuId = menuDto.upMenuId;

                localStorage.setItem('menuGroup', JSON.stringify(menuInfo));
            }
            // /end

            if (nextScrenId !== "") {
                this.goPage(nextScrenId, { pkValue });
                return;
            }
        });
    }

    processNoneButton(noneButtonEl, pkValue = "") {
        if (noneButtonEl === null) {
            return;
        }

        noneButtonEl.addEventListener("click", (e) => {
            const nextScrenId = noneButtonEl.getAttribute("data-next-scren-id");

            // /start - scrnId에 해당하는 메뉴정보 로컬스토리지에 재저장
            const filteredMenuDto  = this.menuDtos.filter(dto => dto.scrnId === nextScrenId);
            const menuInfo = {
                menuId: "",
                upMenuId: "",
                scrnId: ""
            };

            if (filteredMenuDto.length > 0) {
                const menuDto = filteredMenuDto[0];

                menuInfo.menuId = menuDto.menuId;
                menuInfo.upMenuId = menuDto.upMenuId;

                localStorage.setItem('menuGroup', JSON.stringify(menuInfo));
            }
            // /end

            if (nextScrenId !== "") {
                this.goPage(nextScrenId, { pkValue });
                return;
            }
        });
    }

    getRootWrapperEl() {
        const tableEl = document.querySelector(".table");
        let wrapperDiv = null;
        if (tableEl) {
            wrapperDiv = tableEl.closest('div[class^="wrapper-"]');
        }

        return wrapperDiv;
    }

    goPage(scrnId, paramMap) {
        // cache 제거 기능
        let q = "?_=" + new Date().getTime();

        if (Utils.isNotNull(paramMap)) {
            Object.keys(paramMap).forEach((key) => {
                q += "&" + key + "=" + paramMap[key];
            });
        }

        const list = [];
        this.getScrenPath(scrnId, list);
        // 배열 요소 역순으로 변경
        list.reverse();

        if (scrnId.startsWith('SAB')) location.href = API_URL + "html/dashboard/dashboard.html?scrnId=" + scrnId;
        else location.href = API_URL + "html/" + list.join("/") + ".html" + q;
    }

    getScrenPath(scrnId, list) {
        if (Utils.isNull(scrnId)) {
            return list;
        }

        list.push(scrnId);

        const scrnDto = this.scrnDtos.find((dto) => dto.scrnId === scrnId);

        if (!scrnId.startsWith('SAB') && scrnDto.upScrnId !== "-") {
            return this.getScrenPath(scrnDto.upScrnId, list);
        }

        return list;
    }

    /**
    * select element에 공통코드 데이터를 바인딩한다.
    * @param selectEl
    * @param comCdDtos
    * @returns
    */
    bindCodesOfSelect(selectEl, comCdDtos) {
        if (Utils.isNull(selectEl) || Utils.isNull(comCdDtos)) {
            return;
        }

        comCdDtos.forEach((comCdDto) => {
            const optionEl = document.createElement("option");
            optionEl.value = comCdDto.comCd;
            optionEl.innerText = comCdDto.comCdNm;
            selectEl.appendChild(optionEl);
        });
    }

    /**
    * input[type=checkbox] element에 공통코드 데이터를 바인딩한다.
    * @param checkboxEl
    * @param comCdDtos
    * @returns
    */
    bindCodesOfInputCheckbox(checkboxEl, comCdDtos) {
        if (Utils.isNull(checkboxEl) || Utils.isNull(comCdDtos)) {
            return;
        }

        const clonedCheckboxEls = comCdDtos.map((comCdDto) => checkboxEl.cloneNode(true));

        const wrapperEl = checkboxEl.parentElement;
        //  wrapperEl의 max-width, width 변경
        const x = parseInt(wrapperEl.dataset["x"]);
        wrapperEl.style.maxWidth = `${CONTENT_WRAPPER_MAX_WIDTH - x}px`;
        wrapperEl.style.width = `${CONTENT_WRAPPER_MAX_WIDTH - x}px`;

        wrapperEl.removeChild(checkboxEl);

        comCdDtos.forEach((comCdDto, index) => {
            const clonedCheckboxEl = clonedCheckboxEls[index];
            wrapperEl.appendChild(clonedCheckboxEl);
            clonedCheckboxEl.value = comCdDto.comCd;

            const spanEl = document.createElement("span");
            wrapperEl.appendChild(spanEl);
            spanEl.classList.add('chk_radio')
            spanEl.textContent = comCdDto.comCdNm;
        });
    }

    /**
    * input[type=radio] element에 공통코드 데이터를 바인딩한다.(radio element를 동적으로 추가한다)
    * @param radioEl
    * @param comCdDtos
    * @returns
    */
    bindCodesOfInputRadio(radioEl, comCdDtos) {
        if (Utils.isNull(radioEl) || Utils.isNull(comCdDtos)) {
            return;
        }

        // 코드수만큼 radio element 복제
        const clonedRadioEls = comCdDtos.map((comCdDto) => radioEl.cloneNode(true));

        const wrapperEl = radioEl.parentElement;
        //  wrapperEl의 max-width, width 변경
        const x = parseInt(wrapperEl.dataset["x"]);
        const maxContentWrapperWidth = 1000;
        wrapperEl.style.maxWidth = `${maxContentWrapperWidth - x}px`;
        wrapperEl.style.width = `${maxContentWrapperWidth - x}px`;

        // radio el의 name으로 사용할 값
        const radioElName = radioEl.dataset.dataStorageColumnId + "_" + radioEl.dataset.parentCmmnCodeId;

        // 기존 radio element 삭제
        wrapperEl.removeChild(radioEl);

        comCdDtos.forEach((comCdDto, index) => {

            const clonedRadioEl = clonedRadioEls[index];
            wrapperEl.appendChild(clonedRadioEl);
            clonedRadioEl.value = comCdDto.comCd;
            clonedRadioEl.name = radioElName;

            const spanEl = document.createElement("span");
            wrapperEl.appendChild(spanEl);
            spanEl.textContent = comCdDto.comCdNm;
            spanEl.classList.add('chk_radio');
        });
    }

    getFirstScrenUrl() {
        const _xxx = (upScrnId, list) => {
            const arr = this.scrnDtos.filter((dto) => dto.scrnId === upScrnId);
            if (arr.length > 0) {
                menuInfo.scrnId = arr[0].scrnId;
                localStorage.setItem('menuGroup', JSON.stringify(menuInfo));
                list.push(arr[0].scrnId);
                _xxx(arr[0].upScrnId);
            }

            return;
        };

        const _deleteDash = (list) => {
            const index = list.findIndex((scrnId) => scrnId === "-");
            if (index > -1) {
                list.splice(index, 1);
            }
        };

        const list = [];
        const menuInfo = {
            menuId: "",
            upMenuId: "",
            scrnId: ""
        };

        const arrL = this.scrnDtos.filter((dto) => dto.scrnType === "L");
        if (arrL.length > 0) {
            list.push(arrL[0].scrnId);
            _xxx(arrL[0].upScrnId, list);
        } else {
            const arrC = this.scrnDtos.filter((dto) => dto.scrnType === "C");
            if (arrC.length > 0) {
                list.push(arrC[0].scrnId);
                _xxx(arrC[0].upScrnId, list);
            }
        }

        // - 제거
        _deleteDash(list);
        // 역순으로 정렬
        list.reverse();

        const url = `html/${list.join("/")}.html`;
        return url;
    }

    /**
    * 미리보기 이미지 el 생성 메소드
    * @param {*} imageUrl
    * @returns
    */
    createImgPreview(imageUrl) {
        const imgEl = document.createElement("img"); // img 태그 생성
        imgEl.src = imageUrl; // 이미지 미리보기 URL을 나중에 설정할 수 있게 초기화
        imgEl.alt = "이미지 미리보기"; // alt 속성 설정
        imgEl.style.maxWidth = "350px"; // 최대 너비 설정
        imgEl.style.display = "none"; //
        imgEl.classList.add("ms-3"); // 클래스 추가
        imgEl.style.float = "left"; // 오른쪽 정렬
        imgEl.id = "preview";
        return imgEl; // 생성된 img 태그 반환
    }

    /**
    * 파일 el 이벤트리스너 추가 - 이미지 파일과 파일 업로드 시 확장자, 크기 검사와 미리보기 el생성
    * @param {} el
    */
    async processFileInput(el, scrnType) {
        if(scrnType === 'R'){
            return;
        }
        const imgExtensions = ["jpg", "jpeg", "png"].join(", ");
        const allowedExtensions = [ "jpg", "jpeg", "png", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip"];
        const maxFileSize = 10 * 1024 * 1024;
        //이미지 파일인 경우 미리보기 el 생성
        if (el.className === "imgFile") {
            el.after(this.createImgPreview(""));
        }
        //파일을 등록할 때 이벤트
        el.addEventListener("change", async (event) => {
            const target = event.target;
            if (!target || !target.files) return;

            const file = target.files[0];
            const fileExtension = file.name.split(".").pop()?.toLowerCase();
            const previewImage = document.getElementById("preview");
            //이미지 파일인 경우
            if (previewImage) {
                //파일 형식 검사
                if (!fileExtension || !imgExtensions.includes(fileExtension)) {
                    alert("이미지 파일 형식은 " + imgExtensions + "만 가능합니다.");
                    target.value = "";
                    previewImage.src = "";
                    previewImage.style.display = "none";
                    return;
                }
                const reader = new FileReader();
                reader.onload = function (e) {
                    if (e.target) {
                        previewImage.src = e.target.result; // 이미지 미리보기 URL 설정
                        previewImage.style.display = "block";
                    }
                };
                reader.readAsDataURL(file); // 파일을 읽어서 DataURL로 변환
            } //일반 파일인 경우
            else {
                if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                    alert("파일 형식은 " + allowedExtensions.join(", ") + "만 가능합니다." );
                    target.value = "";
                    return;
                }
            }
            //파일 크기 검사
            if (file.size > maxFileSize) {
                alert("파일 크기는 10MB까지 가능합니다.");
                target.value = "";
                return;
            }
        });
    }
}