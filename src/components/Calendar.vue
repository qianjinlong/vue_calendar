<template>
  <div :class="calendar">
    <div :class="calendar_header">
      <div class="calendar_month_selector">
        <button class="selector_month_btn">
          <span @click="PrevMonth">&lt;</span>
        </button>
        <div class="year_month">{{ year }} 年 {{ month + 1 }} 月</div>
        <button class="selector_month_btn">
          <span @click="NextMonth">&gt;</span>
        </button>
      </div>
      <button
        type="button"
        class="calendar_today_btn"
        @click="ToDay"
      >
        <span>今天</span>
      </button>
    </div>

    <div class="calendar_body">
      <div class="calendar_week_names">
        <div class="calendar_week_name">星期日</div>
        <div class="calendar_week_name">星期一</div>
        <div class="calendar_week_name">星期二</div>
        <div class="calendar_week_name">星期三</div>
        <div class="calendar_week_name">星期四</div>
        <div class="calendar_week_name">星期五</div>
        <div class="calendar_week_name">星期六</div>
      </div>
      <div class="calendar_cell_box_wrap">
        <div class="calendar_cell_box">

          <div
            class="calendar_cell_row"
            v-for="(row,i) in listTemp"
            :key="i"
          >
            <div
              :class="['calendar_cell',  j === 0 || j === 6 ? 'calendar_cell_pro' : '']"
              v-for="(cell,j) in row"
              :key="j"
            >
              <div class="calendar_day_label">
                <span
                  :class="['calendar_day_label_text', cell.date === new Date().getDate() && cell.month === new Date().getMonth() + 1 && cell.year === new Date().getFullYear() ? 'calendar_day_label_text_pro' : '']"
                  :id="cell.year + '-' + cell.month + '-' + cell.date"
                >{{ cell.date }}</span>
              </div>
              <div :class="[ (new Date() >= new Date(cell.year, cell.month - 1, cell.date + 1)) ? 'calendar_cell_body_pro' : 'calendar_cell_body']">
                <div
                  :class="['calendar_cell_body_inner', dateClickId === cell.year + '-' + cell.month + '-' + cell.date ? 'calendar_cell_body_inner_pro' : '']"
                  @click="DateClick(cell.year + '-' + cell.month + '-' + cell.date)"
                >
                  <span :class="['calendar_cell_body_inner_logo', dateClickId === cell.year + '-' + cell.month + '-' + cell.date ? 'calendar_cell_body_inner_logo_pro' : '']"></span>
                  <span
                    v-if="cell.title === ''"
                    class="calendar_cell_body_inner_title"
                  > 添加日程标题 </span>
                  <span
                    v-if="cell.title !== ''"
                    class="calendar_cell_body_inner_title"
                  >{{ (cell.title).length > 6 ? cell.title.substr(0,6) + '...' : cell.title }}</span>
                  <div :class="[dateClickId === cell.year + '-' + cell.month + '-' + cell.date ? 'calendar_cell_body_inner_panel' : 'calendar_cell_body_inner_panel_pro']">
                    <div class="calendar_cell_body_inner_panel_item">
                      <span
                        class="calendar_cell_body_inner_panel_item_color"
                        style="background: rgb(228, 136, 132);"
                      ></span>
                      <input
                        class="calendar_cell_body_inner_panel_item_title"
                        type="text"
                        v-model="cell.title"
                        placeholder="添加日程标题"
                      />
                    </div>
                    <div class="calendar_cell_body_inner_panel_item_hr"></div>
                    <div class="calendar_cell_body_inner_panel_item">
                      <div :class="['calendar_cell_body_inner_panel_item_image', 'calendar_cell_body_inner_panel_item_image1']"></div>
                      <span class="calendar_cell_body_inner_panel_item_date">{{ dateClickId }} ~ {{ dateClickId }}</span>
                    </div>
                    <div class="calendar_cell_body_inner_panel_item">
                      <div :class="['calendar_cell_body_inner_panel_item_image', 'calendar_cell_body_inner_panel_item_image2']"></div>
                      <textarea
                        class="calendar_cell_body_inner_panel_item_content"
                        type="text"
                        v-model="cell.content"
                        placeholder="添加日程内容"
                      />
                    </div>

                    <select
                      :class="['colorSelector', ColorSelector(cell.color)]"
                      v-model="cell.color"
                    >
                      <option
                        value="0"
                        style="background: rgb(255, 255, 255)"
                      >默认</option>
                      <option
                        value="1"
                        style="background: rgb(254, 67, 101)"
                      >深红色</option>
                      <option
                        value="2"
                        style="background: rgb(252, 157, 154)"
                      >浅红色</option>
                      <option
                        value="3"
                        style="background: rgb(249, 205, 173)"
                      >浅黄色</option>
                      <option
                        value="4"
                        style="background: rgb(200, 200, 169)"
                      >浅青色</option>
                      <option
                        value="5"
                        style="background: rgb(131, 175, 155)"
                      >淡青色</option>
                    </select>

                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  name: 'Calendar',
  data () {
    return {
      calendar: 'calendar',
      calendar_header: 'calendar_header',
      year: new Date().getFullYear(), // 年: 获取四位的年（yyyy）
      month: new Date().getMonth(), // 月: 获取⽉（0-11）
      date: new Date().getDate(), // 日: 以数值返回天（1-31）
      day: new Date().getDay(), // 星期: 以数值获取周名（0-6）, 0 表示星期天
      dateArray: [{}],
      dateClickId: '', // 是否选中（日期）
      dateTitle: ''
    }
  },
  methods: {
    ToDay () {
      this.year = new Date().getFullYear()
      this.month = new Date().getMonth()
      this.date = new Date().getDate()
      this.day = new Date().getDay()
      var datePrev = new Date(this.year, this.month, 0) // 返回上月末日期
      var dateLast = new Date(this.year, this.month + 1, 0) // 返回这个月末日期
      var dateNext = new Date(this.year, this.month + 1, 1) // 返回下月初日期

      var list = []
      // var i = 0
      // 获取上个月最后一天为周几
      var datePrevDay = datePrev.getDay()
      // 上个月最后一天不为周六
      for (var h = datePrev.getDate(); datePrevDay !== 6 && datePrevDay >= 0; h--) {
        let date = {}
        date.year = datePrev.getFullYear()
        date.month = datePrev.getMonth() + 1
        date.date = h
        date.title = ''
        date.conent = ''
        list.unshift(date)
        datePrevDay--
      }

      for (var j = 1; j <= dateLast.getDate(); j++) {
        let date = {}
        date.year = dateLast.getFullYear()
        date.month = dateLast.getMonth() + 1
        date.date = j
        date.title = ''
        date.conent = ''
        list.push(date)
      }

      // 获取下个月第一天为周几
      var dateNextDay = dateNext.getDay()
      // 下个月第一天不为周日
      for (var k = 1; dateNextDay !== 0 && dateNextDay <= 6; k++, dateNextDay++) {
        let date = {}
        date.year = dateNext.getFullYear()
        date.month = dateNext.getMonth() + 1
        date.date = k
        date.title = ''
        date.conent = ''
        list.push(date)
      }
      this.dateArray = list
    },
    PrevMonth () {
      if (this.month === 0) {
        this.month = 11
        this.year--
      } else {
        this.month--
      }
      var datePrev = new Date(this.year, this.month, 0) // 返回上月末日期
      var dateLast = new Date(this.year, this.month + 1, 0) // 返回这个月末日期
      var dateNext = new Date(this.year, this.month + 1, 1) // 返回下月初日期

      var list = []
      // var i = 0
      // 获取上个月最后一天为周几
      var datePrevDay = datePrev.getDay()
      // 上个月最后一天不为周六
      for (var h = datePrev.getDate(); datePrevDay !== 6 && datePrevDay >= 0; h--) {
        let date = {}
        date.year = datePrev.getFullYear()
        date.month = datePrev.getMonth() + 1
        date.date = h
        date.title = ''
        date.conent = ''
        list.unshift(date)
        datePrevDay--
      }

      for (var j = 1; j <= dateLast.getDate(); j++) {
        let date = {}
        date.year = dateLast.getFullYear()
        date.month = dateLast.getMonth() + 1
        date.date = j
        date.title = ''
        date.conent = ''
        list.push(date)
      }

      // 获取下个月第一天为周几
      var dateNextDay = dateNext.getDay()
      // 下个月第一天不为周日
      for (var k = 1; dateNextDay !== 0 && dateNextDay <= 6; k++, dateNextDay++) {
        let date = {}
        date.year = dateNext.getFullYear()
        date.month = dateNext.getMonth() + 1
        date.date = k
        date.title = ''
        date.conent = ''
        list.push(date)
      }
      this.dateArray = list
    },
    NextMonth () {
      if (this.month === 11) {
        this.month = 0
        this.year++
      } else {
        this.month++
      }

      var datePrev = new Date(this.year, this.month, 0) // 返回上月末日期
      var dateLast = new Date(this.year, this.month + 1, 0) // 返回这个月末日期
      var dateNext = new Date(this.year, this.month + 1, 1) // 返回下月初日期

      var list = []
      // var i = 0
      // 获取上个月最后一天为周几
      var datePrevDay = datePrev.getDay()
      // 上个月最后一天不为周六
      for (var h = datePrev.getDate(); datePrevDay !== 6 && datePrevDay >= 0; h--) {
        let date = {}
        date.year = datePrev.getFullYear()
        date.month = datePrev.getMonth() + 1
        date.date = h
        date.title = ''
        date.conent = ''
        list.unshift(date)
        datePrevDay--
      }

      for (var j = 1; j <= dateLast.getDate(); j++) {
        let date = {}
        date.year = dateLast.getFullYear()
        date.month = dateLast.getMonth() + 1
        date.date = j
        date.title = ''
        date.conent = ''
        list.push(date)
      }

      // 获取下个月第一天为周几
      var dateNextDay = dateNext.getDay()
      // 下个月第一天不为周日
      for (var k = 1; dateNextDay !== 0 && dateNextDay <= 6; k++, dateNextDay++) {
        let date = {}
        date.year = dateNext.getFullYear()
        date.month = dateNext.getMonth() + 1
        date.date = k
        date.title = ''
        date.conent = ''
        list.push(date)
      }
      this.dateArray = list
    },
    DateClick (cell) {
      this.dateClickId = cell
    },
    ColorSelector (color) {
      let colorSelector = 0
      switch (colorSelector) {
        case 0:
          colorSelector = 'color0'
          break
        case 1:
          colorSelector = 'color1'
          break
        case 2:
          colorSelector = 'color2'
          break
        case 3:
          colorSelector = 'color3'
          break
        case 4:
          colorSelector = 'color4'
          break
        case 5:
          colorSelector = 'color5'
          break
        default:
          colorSelector = 'color0'
      }
      return colorSelector
    }
  },
  computed: {
    // v-for 数据分组
    listTemp: function () {
      var list = this.dateArray
      var arrTemp = []
      var index = 0
      var sectionCount = 7
      for (var i = 0; i < list.length; i++) {
        index = parseInt(i / sectionCount)
        if (arrTemp.length <= index) {
          arrTemp.push([])
        }
        arrTemp[index].push(list[i])
      }
      return arrTemp
    }
  },
  mounted () {
    var datePrev = new Date(this.year, this.month, 0) // 返回上月末日期
    var dateLast = new Date(this.year, this.month + 1, 0) // 返回这个月末日期
    var dateNext = new Date(this.year, this.month + 1, 1) // 返回下月初日期

    var list = []
    // var i = 0
    // 获取上个月最后一天为周几
    var datePrevDay = datePrev.getDay()
    // 上个月最后一天不为周六
    for (var h = datePrev.getDate(); datePrevDay !== 6 && datePrevDay >= 0; h--) {
      let date = {}
      date.year = datePrev.getFullYear()
      date.month = datePrev.getMonth() + 1
      date.date = h
      date.title = ''
      date.conent = ''
      date.color = 0
      list.unshift(date)
      datePrevDay--
    }

    for (var j = 1; j <= dateLast.getDate(); j++) {
      let date = {}
      date.year = dateLast.getFullYear()
      date.month = dateLast.getMonth() + 1
      date.date = j
      date.title = ''
      date.conent = ''
      date.color = 0
      list.push(date)
    }

    // 获取下个月第一天为周几
    var dateNextDay = dateNext.getDay()
    // 下个月第一天不为周日
    for (var k = 1; dateNextDay !== 0 && dateNextDay <= 6; k++, dateNextDay++) {
      let date = {}
      date.year = dateNext.getFullYear()
      date.month = dateNext.getMonth() + 1
      date.date = k
      date.title = ''
      date.conent = ''
      date.color = 0
      list.push(date)
    }
    this.dateArray = list
  }
}
</script>
<style scoped>
.calendar {
  background: #fafafa;
  border: 1px solid #fafafa;
  border-radius: 4px;
  padding: 20px 16px 0 16px;
  user-select: none;
  cursor: default;
}

.calendar_header {
  position: relative;
  margin-bottom: 20px;
  z-index: 1;
}

.calendar_month_selector {
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 32px;
  font-size: 16px;
  color: #000;
}

.selector_month_btn {
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  padding: 0;
  margin: 0 20px;
  font-size: 23px;
  color: #8c8c8c;
}

.selector_month_btn:hover {
  color: #000;
}

.selector_month_btn > span {
  display: block-inline;
  font-family: Arial, Helvetica, sans-serif;
}

.year_month {
  width: 120px;
  text-align: center;
  font-size: 18px;
}

.calendar_today_btn {
  outline: none;
  width: 60px;
  height: 32px;
  font-size: 16px;
  color: rbg(89, 89, 89);
  border: 1px rgb(218, 218, 218) solid;
  border-radius: 5%;
  background-color: rgb(250, 250, 250);
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
}

.calendar_today_btn:hover {
  color: #25b864;
  border: 1px #25b864 solid;
  border-radius: 5%;
  cursor: pointer;
  transition: all 0.8s; /* 延迟效果 */
}

.calendar_week_names {
  height: 20px;
  color: #8c8c8c;
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
  display: flex;
  flex-direction: row;
}

.calendar_week_name {
  flex: 1;
}

.calendar_cell_box_wrap {
  position: relative;
  top: 0;
  left: 0;
  margin-top: 5px;
  /* border: 1px rgba(0, 0, 0, 0.2) solid; */
}

.calendar-cell-box {
  position: relative;
  top: 0;
  left: 0;
  background: #d9d9d9;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.calendar_cell_row {
  height: 85px;
  display: flex;
  flex-direction: row;
}

.calendar_cell {
  flex: 1;
  border: 1px rgba(0, 0, 0, 0.2) solid;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
}

.calendar_cell_pro {
  background-color: #fafafa;
}

.calendar_day_label {
  width: 100%;
  font-size: 12px;
  color: #595959;
  display: flex;
  flex-direction: row-reverse;
}

.calendar_day_label_text {
  display: block;
  height: 18px;
  line-height: 18px;
  margin: 0 4px;
}

.calendar_day_label_text_pro {
  width: 18px;
  background-color: #69abe4;
  border-radius: 50%;
  text-align: center;
}

.calendar_cell_body {
  width: 100%;
  height: 58px;
}

.calendar_cell_body_pro {
  visibility: hidden;
}

.calendar_cell_body_inner {
  width: 90%;
  height: 24px;
  background-color: #fcf4f2;
  font-size: 14px;
  color: #bfbfbf;
  margin: 6px;
  cursor: pointer;
  border: 1px #fbdfdb solid;
  border-radius: 3px;
  position: relative;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.calendar_cell_body_inner_pro {
  color: #fff;
  background-color: rgb(228, 136, 132);
}

.calendar_cell_body_inner_logo {
  display: block;
  width: 2px;
  height: 50%;
  margin: 0 5px;
  background-color: #e48884;
}

.calendar_cell_body_inner_logo_pro {
  background-color: #fff;
}

.calendar_cell_body_inner_title {
  display: block;
  width: 80%;
  height: 80%;
  font-size: 12px;
  text-align: center;
  line-height: 160%;
  text-overflow: ellipsis; /* 溢出用省略号*/
  overflow: hidden; /*超出的文本隐藏*/
}

.calendar_cell_body_inner_panel {
  padding: 24px 16px;
  margin: 0 5px;
  position: absolute;
  background-color: #fff;
  box-shadow: 1px 1px rgb(235, 235, 235), -1px -1px rgb(235, 235, 235);
  top: 0px;
  left: 100%;
  z-index: 1;
  cursor: default;
  transition: all 0.5s; /* 延迟效果 */
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
}

.calendar_cell_body_inner_panel_pro {
  display: none;
  transition: all 0.5s; /* 延迟效果 */
}

.calendar_cell_body_inner_panel_item {
  display: flex;
  flex-direction: row;
  margin-bottom: 6px;
}

.calendar_cell_body_inner_panel_item_color {
  display: block;
  width: 5px;
  height: 5px;
  margin: 5px 10px;
  background-color: #e48884;
}

.calendar_cell_body_inner_panel_item_title {
  font-size: 24px;
  border: none;
  outline: none;
}
.calendar_cell_body_inner_panel_item_content {
  font-size: 18px;
  border: none;
  outline: none;
}

.calendar_cell_body_inner_panel_item_hr {
  border-top: 1px solid #f5f5f5;
  margin: 13px 26px 13px 26px;
  height: 1px;
  width: 90%;
}

.calendar_cell_body_inner_panel_item_image {
  width: 16px;
  height: 16px;
  margin: 5px;
  background-repeat: no-repeat;
  background-size: 16px;
}

.calendar_cell_body_inner_panel_item_image1 {
  background-image: url('https://gw.alipayobjects.com/zos/basement_prod/2dd842ba-ea59-4cd1-994e-c5f31bd1ead2.svg');
}

.calendar_cell_body_inner_panel_item_image2 {
  background-image: url('https://gw.alipayobjects.com/zos/basement_prod/a085f457-6982-434a-808d-372cac6624e7.svg');
}

.calendar_cell_body_inner_panel_item_date {
  display: block;
  height: 16px;
  color: #595959;
  font-size: 12px;
  line-height: 26px;
}

.colorSelector {
  position: absolute;
  top: 50px;
  width: 100px;
  height: 20px;
  outline: none;
  border: none;
}

.color0 {
  background-color: rgb(255, 255, 255);
}
.color1 {
  background-color: rgb(254, 67, 101);
}
.color2 {
  background-color: rgb(252, 157, 154);
}
.color3 {
  background-color: rgb(249, 205, 173);
}
.color4 {
  background: rgb(200, 200, 169);
}
.color5 {
  background: rgb(131, 175, 155);
}

</style>
