class fetch_req {
  /**
   * @param {String} url  後端路徑
   */
  constructor(url) {
    this.url = url;
    this.swalert = new swalert();
  }
  /**
   * POST
   * @param {FormData} data 送至後端的資料
   * @returns
   */
  post(data) {
    return new Promise((resolve, reject) => {
      fetch(this.url, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  /**
   * GET
   * @param {FormData} data 送至後端的資料
   * @returns
   */
  get(data) {
    return new Promise((result, reject) => {
      fetch(this.url, {
        method: "GET",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

class datetime {
  constructor() {
    const d = new Date();
    this.year = d.getFullYear();
    this.month = d.getMonth() + 1;
    this.month = this.month < 10 ? `0${this.month}` : this.month;
    this.date = d.getDate();
    this.date = this.date < 10 ? `0${this.date}` : this.date;
    this.hour = d.getHours();
    this.hour = this.hour < 10 ? `0${this.hour}` : this.hour;
    this.min = d.getMinutes();
    this.min = this.min < 10 ? `0${this.min}` : this.min;
    this.sec = d.getSeconds();
    this.sec = this.sec < 10 ? `0${this.sec}` : this.sec;
  }
  /**
   * 可自定義格式，未設置則默認格式為 "yyyy-MM-dd hh:mm:ss"
   * @param {String} format 回傳的日期格式
   * @returns {String} 格式化的日期時間
   */
  datetime(format) {
    let ret_val = null;
    if (format) {
      ret_val = format
        .replace("yyyy", this.year)
        .replace("MM", this.month)
        .replace("dd", this.date)
        .replace("hh", this.hour)
        .replace("mm", this.min)
        .replace("ss", this.sec);
    } else {
      ret_val = `${this.year}-${this.month}-${this.date} ${this.hour}:${this.min}:${this.sec}`;
    }
    return ret_val;
  }
  /**
   * @returns {String} 現在時間：西元年分
   */
  year() {
    return this.year;
  }
  /**
   * @returns {String} 現在時間：月分
   */
  month() {
    return this.month;
  }
  /**
   * @returns {String} 現在時間：日期
   */
  date() {
    return this.date;
  }
  /**
   * @returns {String} 現在時間：小時
   */
  hour() {
    return this.hour;
  }
  /**
   * @returns {String} 現在時間：分鐘
   */
  min() {
    return this.min;
  }
  /**
   * @returns {String} 現在時間：秒
   */
  sec() {
    return this.sec;
  }
}

class swalert {
  constructor() {
    this.Toast = Swal.mixin({
      toast: true,
      position: "top",
      iconColor: "white",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  }

  /**
   * Success Alert
   * @param {String} title 標題
   * @param {String} text  內容
   */
  success(title, text) {
    Swal.fire({
      icon: "success",
      title: title,
      text: text,
      showConfirmButton: false,
      timerProgressBar: true,
      timer: 1500,
    });
  }

  topSuccess(title) {
    this.Toast.fire({
      icon: "success",
      title: title,
      customClass: {
        popup: "bg-success text-white",
      },
    });
  }

  /**
   * Warning Alert
   * @param {String} title 標題
   * @param {String} text  內容
   * @param {Function} callback  確認後執行函式
   */
  warning(title, text, callback) {
    Swal.fire({
      icon: "warning",
      title: title,
      text: text,
      showCancelButton: true,
    }).then((res) => {
      if (!res.isConfirmed) return;
      callback();
    });
  }

  topWarning(title) {
    this.Toast.fire({
      icon: "warning",
      title: title,
      customClass: {
        popup: "bg-warning text-white",
      },
    });
  }

  /**
   * Error Alert
   * @param {String} title 標題
   * @param {String} text  內容
   */
  error(title, text, callback) {
    Swal.fire({
      icon: "error",
      title: title,
      text: text,
    }).then((res) => {
      if (!res.isConfirmed) return;
      callback();
    });
  }

  topError(title) {
    this.Toast.fire({
      icon: "error",
      title: title,
      customClass: {
        popup: "bg-danger text-white",
      },
    });
  }
}
