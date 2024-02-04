# 載入 Flask 與 request
from flask import Flask, request, render_template
from datetime import datetime as dt
from db import sql
import pandas as pd

# 建立 app 變數為 Flask 物件，__name__ 表示目前執行的程式
app = Flask(__name__)


@app.route("/")  # 函式裝飾器，建立一個路由（Routes），可針對主網域發出 GET 請求
def index():  # 對主網域發出請求後執行 index() 函式
    # IP:port/?name=IU&age=30 => [('name', 'IU'), ('age', '30')]
    print(request.args)  # 使用 request.args 取得網址參數，格式為 tuple
    print(request.form)  # 取得 POST 請求傳遞的資料
    return render_template("index.html")  # 回傳特定網頁內容


@app.route("/<path:msg>")  # 加入 psth: 轉換成【路徑】的類型
def routes(msg):
    match msg:
        case "sup":
            return render_template("sup.html")
        case "sale":
            return render_template("sale.html")
        case "title":
            return render_template("datatitle.html")
        case _:
            return render_template("none.html")


@app.route("/data_titles", methods=["POST"])
def data_titles():
    check_code = "ok"
    check_msg = ""
    try:
        con_str = str()
        TABLE_NAME = request.form.get("TABLE_NAME")
        if bool(TABLE_NAME):
            con_str += f"(sql.db['TABLE_NAME'] == '{TABLE_NAME}')"
        check_msg = sql.query("DataTitles", con_str)
    except Exception as e:
        check_code = "-1"
        check_msg = f"DataTitles Fail：{str(e)}"
    finally:
        return {"check_code": check_code, "check_msg": check_msg}

@app.route("/post_datatitle", methods=["POST"])
def post_datatitle():
    check_code = "ok"
    check_msg = ""
    try:
        table_name = "DataTitles"
        check_msg = sql.query(table_name, "")
    except Exception as e:
        check_code = "-1"
        check_msg = f"DataTitles Fail：{str(e)}"
    finally:
        return {"check_code": check_code, "check_msg": check_msg}

@app.route("/post_sup", methods=["POST"])
def post_sup():
    check_code = "ok"
    check_msg = ""
    try:
        table_name = "SUPPLIERS"
        form = request.form
        CMD = form.get("CMD")
        now = get_now()
        if CMD == "add_new":
            data = {
                "SUP_ID": form.get("SUP_ID"),
                "SUP_NAME": form.get("SUP_NAME"),
                "CREATE_TIME": now,
                "UPDATE_TIME": now,
            }
            con_str = f"(sql.db['SUP_ID'] == '{data['SUP_ID']}')"
            if sql.check_already(table_name, con_str):
                check_code = "-1"
                check_msg = f"廠商代號重複：{data['SUP_ID']}"
            else:
                sql.add_new(table_name, data)
                check_msg = "新增成功！"
        elif CMD == "del":
            data = {
                "SUP_ID": form.get("SUP_ID"),
                "SUP_NAME": form.get("SUP_NAME")
            }
            con_str = str()
            for key, val in data.items():
                con_str += f"(sql.db['{key}'] == '{val}') & "
            sql.dele(table_name, con_str[:-3])
            check_msg = data["SUP_ID"]
        elif CMD == "update":
            print("update")
        else:
            check_msg = sql.query(table_name, "")
    except Exception as e:
        check_code = "-1"
        check_msg = f"Sup Fail：{str(e)}"
    finally:
        return {"check_code": check_code, "check_msg": check_msg}

@app.route("/select_option", methods=["POST"])
def select_option():
    check_code = "ok"
    check_msg = ""
    try:
        table_name = "SELECT_OPTIONS"
        select = request.form.get("SELECT")
        if select == "SUPPLIERS":
            data = sql.query("SUPPLIERS")
            print(data)
        elif bool(select):
            check_msg = sql.query(table_name, f"(sql.db['SELECT'] == '{select}')")
    except Exception as e:
        check_code = "-1"
        check_msg = str(e)
    finally:
        return {"check_code": check_code, "check_msg": check_msg}

def get_now():
    return dt.now().strftime("%Y-%m-%d %H:%M:%S")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1130)  # 以特定 IP 與 port 執行
