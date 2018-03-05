$(document).ready(function () {

    // jQuery - Авто калькулятор

    var modelPrice = 0;         // Цена в рублях
    var modelSpecs = '';        // Спецификации

    var $modelSpecsHolder = $('#modelSpecs');       // Блок для вывода спецификаций
    var $modelPriceHolder = $('#modelPrice');       // Блок для вывода цены в рублях
    var $modelPriceUSDHolder = $('#modelPriceUSD'); // Блок для вывода цены в долларах
    var $imgHolder = $('#imgHolder img');           // Картинка автомобиля

    // Получаем курс валют
    var rurUsdRate = 1;
    var currencyURL = 'https://www.cbr-xml-daily.ru/daily_json.js';

    // Ajax запрос для получения текущего курса валют
    $.ajax({
        url: currencyURL,
        cache: false,
        dataType: "json",
        success: function (obj) {
            rurUsdRate = parseFloat( obj.Valute.USD.Value );
            console.log( obj.Valute.USD.Value );
            console.log( rurUsdRate );
        }
    });

    // Вывод при старте страницы
    calculatePrice();           // Цена в рублях
    compileSpecs();             // Спецификации

    /**
     * Событие - изменение спецификаций автомоблиля.
     */
    $('#autoForm input').on('change', function () {
        compileSpecs();
        calculatePrice();
        calculateUSD();
    });

    /**
     * Событие - выбор цвета автомоблиля.
     * На цену не влияет.
     */
    $('.colorItem').on('click', function () {
        var $imgPath = $(this).attr('data-img-path');
        var $colorName = $(this).attr('data-color-name');

        $imgHolder.attr('src', $imgPath);
        $imgHolder.attr('data-color-name', $colorName);

        compileSpecs();
    });

    /**
     * Функция выводит выбранные спецификации.
     */
    function compileSpecs() {
        modelSpecs  = $('input[name=engine]:checked + label', '#autoForm').text()       + '<br>';
        modelSpecs += $('input[name=transmission]:checked + label', '#autoForm').text() + '<br>';
        modelSpecs += $('input[name=package]:checked + label', '#autoForm').text()      + '<br>';
        modelSpecs += $imgHolder.attr('data-color-name');

        // Вывод спецификаций
        $modelSpecsHolder.html( modelSpecs );
    }

    /**
     * Функция вычисляет и выводит цену в рублях.
     */
    function calculatePrice() {
        var $priceEngine = $('input[name=engine]:checked', '#autoForm').val(),
            $priceTransmission = $('input[name=transmission]:checked', '#autoForm').val(),
            $pricePackage = $('input[name=package]:checked', '#autoForm').val();

        $priceEngine = parseInt($priceEngine);
        $priceTransmission = parseInt($priceTransmission);
        $pricePackage = parseInt($pricePackage);

        // сохранить результат в переменную
        modelPrice = $priceEngine + $priceTransmission + $pricePackage;

        // вывести результат на экран
        $modelPriceHolder.text( addSpace(modelPrice) + ' руб' );
    }

    /**
     * Функция вычисляет и выводит цену в долларах.
     */
    function calculateUSD() {
        var modelPriceUSD = modelPrice / rurUsdRate;

        // вывести результат на экран
        $modelPriceUSDHolder.text( '$ ' + addSpace(modelPriceUSD.toFixed() ) );
    }

    /**
     * Функция добавляет пробелы в большие числа
     */
    function addSpace(numStr) {
        numStr += '';                               // превращаем число в строку
        x = numStr.split('.');                      // разбиваем строку на массив (цифры до и после запятой)
        x1 = x[0];                                  // цифры до запятой
        x2 = x.length > 1 ? '.' + x[1] : '';        // цифры после запятой, если они есть

        var rgx = /(\d+)(\d{3})/;                   // правило для проверки (регулярное выражение)

        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ' ' + '$2'); // на пробелы разделяется только число до запятой
        }

        return x1 + x2;                             // вернуть строку (цифры до и после запятой)
    }
});