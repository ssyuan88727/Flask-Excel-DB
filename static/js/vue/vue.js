const { createApp } = Vue;
const delimiters = ["%{", "}%"];
const fr = new fetch_req(sets.post_url);
const sw = new swalert();

// 導覽列內容
const navbar_vm = createApp({
  delimiters: delimiters,
  data() {
    return {
      pages: [
        { id: "home", href: "/", text: "首頁" },
        { id: "prod", href: "/prod", text: "商品" },
        { id: "sup", href: "/sup", text: "廠商" },
        { id: "order", href: "/sale", text: "銷售" },
        { id: "pur", href: "/pur", text: "追加" },
        { id: "fin", href: "/fin", text: "財務" },
        { id: "title", href: "/title", text: "標題" },
      ],
    };
  },
}).mount("#navbarCollapse");

// 頁面按鈕
const btns_vm = createApp({
  delimiters: delimiters,
  data() {
    const btns = {
      add_new: {
        method: "toggle_inputs('add_new')",
        icon: "fa-solid fa-plus",
        text: "新增",
      },
      query: {
        method: "toggle_inputs('query')",
        icon: "fa-solid fa-magnifying-glass",
        text: "查詢",
      },
      del: {
        method: "del_checked()",
        icon: "fa-solid fa-trash-can",
        text: "刪除勾選",
      },
      import_xlsx: {
        method: "import_xlsx()",
        icon: "fa-solid fa-folder-closed",
        text: "匯入 EXCEL",
      },
    };
    const temp_btns = new Array();
    sets.btns.forEach((e) => {
      temp_btns.push(btns[e]);
    });
    return { btns: temp_btns };
  },
  methods: {
    btn_method(type) {
      eval(`this.${type}`);
    },
    toggle_inputs(type) {
      if (type == "add_new") {
        $("#query").slideUp();
      } else if (type == "query") {
        $("#add_new").slideUp();
      }
      $(`#${type}`)
        .slideToggle()
        .find("input, select")
        .not("[type='hidden']")[0]
        .focus();
    },
    async del_checked() {
      const checkboxes = $("#table")
        .find("input[type='checkbox']")
        .not("#check_all");
      let success_item = "";
      for (let i = 0; i < checkboxes.length; i++) {
        const ele = checkboxes[i];
        if (ele.checked) {
          const data = new FormData(),
            row_dara = table.row(i).data();
          data.append("CMD", "del");
          for (let key in row_dara) {
            data.append(key, row_dara[key]);
          }
          const req = new fetch_req(sets.post_url),
            { check_code, check_msg } = await req.post(data);
          if (check_code != "ok") {
            console.error(`刪除失敗：${check_msg}`);
          } else {
            success_item += `${check_msg}、`;
          }
        }
      }
      if (success_item) sw.success("刪除成功", success_item.slice(0, -1));
      redraw_table();
    },
    import_xlsx() {
      console.log("import_xlsx");
    },
  },
}).mount("#btns");
