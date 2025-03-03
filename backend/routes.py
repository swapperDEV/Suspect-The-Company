from flask import Blueprint, request, jsonify
from finance_charts_utils import get_stock_data_by_ticker, get_stock_data_by_company_name
from finance_indicators import get_financial_indicators

routes = Blueprint('routes', __name__)

#Wykres
@routes.route('/api/stock_data_by_ticker', methods=['GET'])
def stock_data_by_ticker_endpoint():
    ticker = request.args.get('ticker')
    period = request.args.get('period', '1mo')
    interval = request.args.get('interval', '1d')

    if not ticker:
        return jsonify({'error': 'Musisz podać ticker.'}), 400

    data = get_stock_data_by_ticker(ticker, period, interval)

    if data:
        return jsonify(data)
    else:
        return jsonify({'error': f'Błąd pobierania danych dla tickera "{ticker}".'}), 500


@routes.route('/api/stock_data_by_company_name', methods=['GET'])
def stock_data_by_company_name_endpoint():
    company_name = request.args.get('name')
    period = request.args.get('period', '1mo')
    interval = request.args.get('interval', '1d')

    if not company_name:
        return jsonify({'error': 'Musisz podać nazwę firmy.'}), 400

    data = get_stock_data_by_company_name(company_name, period, interval)

    if data:
        return jsonify(data)
    else:
        return jsonify({'error': f'Błąd pobierania danych dla firmy "{company_name}".'}), 500


#Wskazniki
@routes.route('/api/indicators', methods=['GET'])
def fetch_indicators_endpoint():
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({'error': 'Musisz podać ticker.'}), 400

    indicators = get_financial_indicators(ticker)

    if indicators:
        return jsonify(indicators)
    else:
        return jsonify({'error': f'Błąd pobierania wskaźników dla tickera "{ticker}".'}), 500