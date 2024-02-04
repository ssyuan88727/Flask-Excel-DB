let table = null;

$(async () => {
  await getDataTitles();
  await getData();

  ["add_new", "query"].forEach((e) => {
    draw_inputs(e);
  });
  draw_table();
});

const getDataTitles = async () => {
  const data = new FormData();
  data.append("TABLE_NAME", sets.h_sheets);

  const req = new fetch_req("/data_titles"),
    res = await req.post(data),
    { check_code, check_msg } = res;

  if (check_code != "ok") {
    sw.error("DataTitles Error", check_msg);
    console.error(`DataTitles Error：${check_msg}`);
  } else {
    sets.DataTitles = check_msg.slice();
  }
};

const getData = async () => {
  const { check_code, check_msg } = await fr.post();
  if (check_code != "ok") {
    console.error(`資料獲取錯誤：${check_msg}`);
    sw.error("資料獲取錯誤", check_msg);
  } else {
    sets.data = check_msg.slice();
  }
};

const draw_inputs = async (type) => {
  // 畫 input group
  const DataTitles = sets.DataTitles,
    dt_length = DataTitles.length;
  let newHTML = ``;

  if (type == "add_new") {
    // 新增
    for (let i = 0; i < dt_length; i += 2) {
      newHTML += `<div class="d-flex jc-start ai-center mb-3 w-100">`;
      // 左邊
      const l_DataTitles = DataTitles[i];
      if (l_DataTitles.ADDABLE == "Y") {
        const required = l_DataTitles.REQUIRED == "Y";
        newHTML +=
          `<div class="input-group me-3 w-50">` +
          `<span class="input-group-text">${required ? "*" : ""} ${
            l_DataTitles.NAME
          }</span>`;

        if (l_DataTitles.TYPE == "select") {
          const options = await eval(l_DataTitles.METHODS);
          newHTML +=
            `<select name="${l_DataTitles.COLUMN}" class="form-control" ${
              required ? "required" : ""
            }>` +
            `<option value=""></option>` +
            options +
            `</select>`;
        } else {
          newHTML += `<input type="${l_DataTitles.TYPE}" name="${
            l_DataTitles.COLUMN
          }" class="form-control" ${required ? "required" : ""}>`;
        }
        newHTML += `</div>`;
      }

      // 右邊
      if (i + 1 < dt_length) {
        const r_DataTitles = DataTitles[i + 1];
        if (r_DataTitles.ADDABLE == "Y") {
          const required = r_DataTitles.REQUIRED == "Y";
          newHTML +=
            `<div class="input-group w-50">` +
            `<span class="input-group-text">${required ? "*" : ""} ${
              r_DataTitles.NAME
            }</span>`;
          if (r_DataTitles.TYPE == "select") {
            const options = await eval(r_DataTitles.METHODS);
            newHTML +=
              `<select name="${r_DataTitles.COLUMN}" class="form-control" ${
                required ? "required" : ""
              }>` +
              `<option value=""></option>` +
              options +
              `</select>`;
          } else {
            newHTML += `<input type="${r_DataTitles.TYPE}" name="${
              r_DataTitles.COLUMN
            }" class="form-control" ${required ? "required" : ""}>`;
          }
          newHTML += `</div>`;
        }
      }
      newHTML += `</div>`;
    }
    newHTML += `<input type="hidden" name="CMD" value="add_new">`;
  } else if (type == "query") {
    // 查詢
    for (let i = 0; i < dt_length; i += 2) {
      newHTML += `<div class="d-flex jc-start ai-center mb-3 w-100">`;
      // 左邊
      const l_DataTitles = DataTitles[i];
      newHTML +=
        `<div class="input-group me-3 w-50">` +
        `<span class="input-group-text">${l_DataTitles.NAME}</span>`;

      if (l_DataTitles.TYPE == "select") {
        const options = await eval(l_DataTitles.METHODS);
        newHTML +=
          `<select name="${l_DataTitles.COLUMN}" class="form-control">` +
          `<option value=""></option>` +
          options +
          `</select>`;
      // } else if (l_DataTitles.TYPE == "datetime-local") {
        // newHTML +=
        //   `<input type="datetime-local" name="S_${l_DataTitles.COLUMN}" class="form-control">` +
        //   `<span class="input-group-text">~</span>` +
        //   `<input type="datetime-local" name="E_${l_DataTitles.COLUMN}" class="form-control">`;
      } else {
        newHTML += `<input type="${l_DataTitles.TYPE}" name="${l_DataTitles.COLUMN}" class="form-control">`;
      }
      newHTML += `</div>`;

      // 右邊
      if (i + 1 < dt_length) {
        const r_DataTitles = DataTitles[i + 1];
        newHTML +=
          `<div class="input-group w-50">` +
          `<span class="input-group-text">${r_DataTitles.NAME}</span>`;

        if (r_DataTitles.TYPE == "select") {
          const options = await eval(r_DataTitles.METHODS);
          newHTML +=
            `<select name="${r_DataTitles.COLUMN}" class="form-control">` +
            `<option value=""></option>` +
            options +
            `</select>`;
        // } else if (r_DataTitles.TYPE == "datetime-local") {
        //   newHTML +=
        //     `<input type="datetime-local" name="S_${r_DataTitles.COLUMN}" class="form-control">` +
        //     `<span class="input-group-text">~</span>` +
        //     `<input type="datetime-local" name="E_${r_DataTitles.COLUMN}" class="form-control">`;
        } else {
          newHTML += `<input type="${r_DataTitles.TYPE}" name="${r_DataTitles.COLUMN}" class="form-control">`;
        }
        newHTML += `</div>`;
      }
      newHTML += `</div>`;
    }
  }

  // 按鈕
  newHTML +=
    `<div class="d-flex jc-center ai-center mb-3">` +
    `<button type="submit" class="btn btn-dark me-3">` +
    `<i class="fa-solid fa-check"></i> 確認` +
    `</button>` +
    `<button class="btn btn-dark" onclick="close_inputs(event, this)">` +
    `<i class="fa-solid fa-xmark"></i> 離開` +
    `</button>` +
    `</div>`;
  $(`#${type}`).html(newHTML);
};

$("#add_new").submit(async (e) => {
  e.preventDefault();
  const data = new FormData(e.target),
    inputs = $(e.target).find("input, select").not("[type='hidden']"),
    { check_code, check_msg } = await fr.post(data);
  if (check_code != "ok") {
    console.error(check_msg);
    sw.error("新增錯誤", check_msg, () => {
      setTimeout(() => {
        inputs[0].focus();
      }, 500);
    });
  } else {
    sw.topSuccess(check_msg);
    redraw_table();
    inputs.val("");
    inputs[0].focus();
  }
});

const draw_table = () => {
  const columns = new Array();
  sets.render_columns.forEach((e) => {
    const temp = {
      data: null,
      orderable: false,
    };
    if (e == "checkbox") {
      temp.title = `<input type="checkbox" id="check_all" class="form-check-input" onclick="check_all(this)">`;
      temp.render = () => {
        return `<input type="checkbox" class="form-check-input">`;
      };
    } else if (e == "action") {
      temp.title = "動作";
      temp.render = () => {
        return `<button class="btn" name="action" onclick="action(this)"><i class="fa-solid fa-pen-to-square"></i></button>`;
      };
    } else if (e == "del") {
      temp.title = "刪除";
      temp.render = () => {
        return `<button class="btn" name="del" onclick="del(this)"><i class="fa-solid fa-xmark"></i></button>`;
      };
    }
    columns.push(temp);
  });

  sets.DataTitles.forEach((e) => {
    const temp = {};
    temp.data = e.COLUMN;
    temp.title = e.NAME;
    temp.orderable = e.ORDERABLE == "Y";
    columns.push(temp);
  });

  table = $("#table").DataTable({
    data: sets.data,
    columns: columns,
    searching: true,
    language: language,
  });
  $("#table_filter").remove();
};

const redraw_table = async () => {
  await getData();
  table.clear().rows.add(sets.data).draw();
};

$("#query").submit((e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  let i = 0 + sets.render_columns.length;
  data.forEach((val, key) => {
    table.column(i).search(val);
    i++;
  });
  table.draw();
});

const close_inputs = (e, ele) => {
  e.preventDefault();
  $($(ele).parents()[1]).slideUp();
};

const check_all = (ele) => {
  $("#table").find("input[type='checkbox']").prop("checked", ele.checked);
};

const action = (ele) => {
  const data = data_to_formdata(
    table.row($("[name='action']").index(ele)).data()
  );
  if (sets.body_is_open) {
  } else {
  }
};

const del = async (ele) => {
  console.log(table.row($("[name='del']").index(ele)).data());
  const data = data_to_formdata(table.row($("[name='del']").index(ele)).data());
  data.append("CMD", "del");
  const { check_code, check_msg } = await fr.post(data);
  if (check_code != "ok") {
    console.error(`刪除失敗：${check_msg}`);
    sw.error("刪除失敗", check_msg);
  } else {
    sw.topSuccess(`${check_msg} 刪除成功`);
    redraw_table();
  }
};

/**
 * 將物件資料轉換為 FormData 並回傳
 * @param {Object} data
 * @returns {FormData}
 */
const data_to_formdata = (data) => {
  const form_data = new FormData();
  for (let key in data) {
    form_data.append(key, data[key]);
  }
  return form_data;
};

const select_options = async (select) => {
  const data = new FormData();
  data.append("SELECT", select);
  const req = new fetch_req("/select_option"),
    { check_code, check_msg } = await req.post(data);
  if (check_code != "ok") {
    sw.error("獲取選項錯誤", check_msg);
    console.error(`獲取選項錯誤：${check_msg}`);
    return "";
  } else {
    let newHTML = "";
    check_msg.forEach((e) => {
      newHTML += `<option value="${e.VALUE}">${e.TEXT}</option>`;
    });
    return newHTML;
  }
};

$(document).ajaxStart(() => {
  $("body").append(
    `<div id="loading" style="display: none;">` +
      `<div class="d-flex jc-center">` +
      `<div class="spinner-border" role="status">` +
      `<span class="visually-hidden">Loading...</span>` +
      `</div></div></div>`
  );
  $("#loading").fadeIn();
});

$(document).ajaxStop(() => {
  $("#loading").fadeOut().remove();
});
