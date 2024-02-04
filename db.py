import pandas as pd

class sql:
    db = None
    db_path = {
        "SUPPLIERS": r"./static/db/SUPPLIERS.xlsx",
        "SALE_H": r"./static/db/SALE_H.xlsx",
        "SALE_B": r"./static/db/SALE_B.xlsx",
        "DataTitles": r"./static/db/DataTitles.xlsx",
        "SELECT_OPTIONS": r"./static/db/SELECT_OPTIONS.xlsx",
    }

    @staticmethod
    def read_excel(table_name):
        return pd.read_excel(sql.db_path[table_name]).fillna("").astype(str)
    
    @staticmethod
    def query(table_name, con_str):
        '''
        Para:
        table_name(String):sheet 名稱
        con_str(String):篩選條件

        return:
        錯誤訊息(String) || 資料內容(Dictionary)
        '''
        sql.db = sql.read_excel(table_name)
        if bool(con_str):
            sql.db = sql.db[eval(con_str)]
        return sql.db.to_dict(orient="records")
            
    @staticmethod
    def add_new(table_name, data):
        data = pd.DataFrame([data])
        sql.db = sql.read_excel(table_name)
        pd.concat([sql.db, data], ignore_index=True).to_excel(sql.db_path[table_name], index=False)
        sql.db = None
    
    @staticmethod
    def check_already(table_name, con_str):
        return bool(sql.read_excel(table_name)[eval(con_str)].to_dict(orient="records"))
    
    @staticmethod
    def dele(table_name, con_str):
        sql.db = sql.read_excel(table_name)[~eval(con_str)]
        sql.db.to_excel(sql.db_path[table_name], index=False)
        sql.db = None

    @staticmethod
    def update(table_name, con_str):
        sql.db = sql.read_excel(table_name)
        print("update")
        sql.db = None



