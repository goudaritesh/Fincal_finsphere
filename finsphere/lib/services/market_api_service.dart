import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/index_model.dart';
import '../models/stock_model.dart';

class MarketApiService {
  // Alpha Vantage uses 'demo' API key for test endpoints
  static const String alphaVantageApiKey = 'demo'; 

  /// Fetch Index data from Yahoo Finance API
  Future<IndexModel?> fetchIndex(String symbol, String name) async {
    try {
      final url = Uri.parse('https://query1.finance.yahoo.com/v8/finance/chart/$symbol');
      final response = await http.get(url);
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final result = data['chart']['result'][0];
        final meta = result['meta'];
        
        final currentPrice = meta['regularMarketPrice']?.toDouble() ?? 0.0;
        final previousClose = meta['previousClose']?.toDouble() ?? 0.0;
        
        return IndexModel(
          name: name,
          symbol: symbol,
          currentPrice: currentPrice,
          previousClose: previousClose,
        );
      }
    } catch (e) {
      print('Error fetching index $symbol: $e');
    }
    return null;
  }

  /// Fetch Top Gainers & Losers from Alpha Vantage API
  Future<Map<String, List<StockModel>>> fetchTopGainersLosers() async {
    try {
      final url = Uri.parse('https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=$alphaVantageApiKey');
      final response = await http.get(url);
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        
        List<StockModel> gainers = [];
        List<StockModel> losers = [];
        
        if (data['top_gainers'] != null) {
          gainers = (data['top_gainers'] as List).take(5).map((e) => _parseAlphaVantageStock(e)).toList();
        }
        
        if (data['top_losers'] != null) {
          losers = (data['top_losers'] as List).take(5).map((e) => _parseAlphaVantageStock(e)).toList();
        }
        
        return {
          'gainers': gainers,
          'losers': losers,
        };
      }
    } catch (e) {
      print('Error fetching gainers/losers: $e');
    }
    return {'gainers': [], 'losers': []};
  }

  StockModel _parseAlphaVantageStock(Map<String, dynamic> json) {
    return StockModel(
      ticker: json['ticker'] ?? 'Unknown',
      price: double.tryParse(json['price'] ?? '0') ?? 0.0,
      changeAmount: double.tryParse(json['change_amount'] ?? '0') ?? 0.0,
      changePercentage: double.tryParse((json['change_percentage'] ?? '0').replaceAll('%', '')) ?? 0.0,
      volume: int.tryParse(json['volume'] ?? '0') ?? 0,
    );
  }
}
