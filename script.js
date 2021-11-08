$(document).ready(function() {

  // установка понедельника 1 днём недели
  moment.updateLocale('en', {
    week: {
      dow : 1,
    }
  });


  $('#data').on('keyup', function() {
    var str = $(this).val(); // введённое значение
    var count_of_errors = -1;

    if(!str) {
      $('#anyinfo').addClass("correctdata-noshow"); // сокрытие любой информации при пустой строке
    }
    else {
      $('#anyinfo').removeClass("correctdata-noshow"); // включение видимости блока показа информации
    }
    $('#showinfo-block').removeClass("correctdata-show"); // сокрытие блока с информацией о дате

    // проверка на наличие счетчика
    if(typeof timeout_timer !== 'undefined') {
      clearTimeout(timeout_timer);
    }

    // проверка на правильность введенного значения
    if(str.length < 10) {
      $('#output-info').html("<b style=\"color: red;\">Введите дату формата ДД-ММ-ГГГГ</b>"); // надпись выводится при неполном заполнении поля (10 симв)
    }
    else {
      var pattern = new RegExp("[0-3][0-9]-[0-1][0-9]-[0-9]{4}"); // паттерн, по которому определяется правильность формата
      if(str.match(pattern)) {
        $('#output-info').html("<b style=\"color: black;\">Введённая дата: </b>" + str);

        var date_array = str.split('-'); // массив из элементов введенной даты
        var day = date_array[0];
        var month = date_array[1] - 1;
        var year = date_array[2];
        var date_obj = new Date(year, month, day); // создание объекта типа дата
        count_of_errors = 0;

        if(day != date_obj.getDate()) {
          $('#output-info').html("<b style=\"color: red;\">День введён неверно</b>");
          count_of_errors++;
        }
        if(month != date_obj.getMonth()) {
          $('#output-info').html("<b style=\"color: red;\">Месяц введён неверно</b>");
          count_of_errors++;
        }
        if(year != date_obj.getFullYear()) {
          $('#output-info').html("<b style=\"color: red;\">Год введён неверно</b>");
          count_of_errors++;
        }
        if(count_of_errors > 1) {
          $('#output-info').html("<b style=\"color: red;\">Дата введена неверно</b>");
        }
      }
      else {
        $('#output-info').html("<b style=\"color: red;\">Дата введена неверно</b>");
      }
    }

    if(count_of_errors == 0) {
      var date_obj_now = new Date(Date.now()); // объект времени (текущее время)
      var diff_dates = new Date(date_obj.getTime() - date_obj_now.getTime() - 1000 * 60 * 60 * 3);
      var diff_years = parseInt(diff_dates.getFullYear() - 1970);

      if(date_obj > date_obj_now && diff_years < 10) {
        var date_obj_only_year = new Date(date_obj.getFullYear(), 0, 0); // объект времени (год введенной даты)
        var day_number = diffInDays(date_obj, date_obj_only_year); // определение номера дня в году
        var week_number = moment(date_obj, "DDMMYYYY").week(); // нахождение номера недели (неделя начинается с понедельника)

        // установление корректного номера недели, если 1 день в году определен как последняя неделя предыдущего
        if(moment(new Date(date_obj.getFullYear(), 0, 0), "DDMMYYYY").week() != 1) {
          if(date_obj.getDate() == 1) {
            week_number = 1;
          }
          else {
            week_number++;
          }
        }

        $('#showinfo-block').addClass("correctdata-show"); // сделать блок с информацией о дате видимым
        $('#day-number').html("<b> Номер дня в году: </b>" + day_number);
        $('#week-number').html("<b> Номер недели в году: </b>" + week_number);

        var count_leap_years = 0;

        // определение количества високосных годов в промежутке
        if(diff_years > 0) {
          for(i = date_obj_now.getFullYear(); i <= date_obj.getFullYear(); i++) {
            if(isLeapYear(i)) {
              count_leap_years++;
            }
          }
        }

        var diff_days = parseInt(diff_dates / 24 / 60 / 60 / 1000 - diff_years * 365 - count_leap_years);
        var diff_hours = parseInt(diff_dates.getHours());
        var diff_minutes = parseInt(diff_dates.getMinutes());
        var diff_seconds = parseInt(diff_dates.getSeconds());

        counter();
      }
      else if(diff_years >= 10) {
        var date_obj_max = new Date(year + 10, month, day); // создание объекта максимальной даты
        var max_day = date_obj_now.getDate();
        if(max_day < 10) {
          max_day = "0" + max_day;
        }
        var max_month = date_obj_now.getMonth();
        if(max_month < 10) {
          max_month = "0" + max_month;
        }
        var max_year = date_obj_now.getFullYear() + 10;
        $('#output-info').html("<b style=\"color: red;\">Введённая дата должна быть не поздее " + max_day + "-" + max_month + "-" + max_year + "</b>");
      }
      else {
        $('#output-info').html("<b style=\"color: red;\">Введённая дата уже наступила</b>");
      }
    }

    // проверка на високосный год
    function isLeapYear(year) {
      return new Date(year, 1, 29).getMonth() == 1;
    }

    // разница между датами в днях
    function diffInDays(date1, date2) {
      return (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())) / 24 / 60 / 60/ 1000;
    }

    // счётчик времени
    function counter() {
      timeout_timer = setTimeout(counter, 1000);
      $('#counter_years').text(diff_years);
      $('#counter_days').text(diff_days);
      $('#counter_hours').text(diff_hours);
      $('#counter_minutes').text(diff_minutes);
      $('#counter_seconds').text(diff_seconds);
      diff_seconds--;
      if(diff_seconds < 0) {
        diff_seconds = 59;
        diff_minutes--;
        if(diff_minutes < 0) {
          diff_minutes = 59;
          diff_hours--;
          if(diff_hours < 0) {
            diff_hours = 23;
            diff_days--;
            if(diff_days < 0) {
              diff_days = 365;
              diff_years--;
              if(diff_years < 0) {
                diff_years = 0;
                diff_days = 0;
                diff_hours = 0;
                diff_minutes = 0;
                diff_seconds = 0;
              }
            }
          }
        }
      }
    }

  });


});
