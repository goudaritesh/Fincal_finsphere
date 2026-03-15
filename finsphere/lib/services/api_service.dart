import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Use String.fromEnvironment to allow setting these during build:
  // flutter run --dart-define=NODE_URL=https://your-node-app.onrender.com/api
  static const String nodeBaseUrl = String.fromEnvironment(
    'NODE_URL', 
    defaultValue: 'http://localhost:3000/api'
  );
  static const String pythonBaseUrl = String.fromEnvironment(
    'PYTHON_URL', 
    defaultValue: 'http://localhost:8000'
  );
  
  static String? _token;

  // Set the JWT token
  static void setToken(String token) {
    _token = token;
  }

  static Future<bool> loginMock() async {
    try {
      final response = await http.post(
        Uri.parse('$nodeBaseUrl/login'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'name': 'Ritesh Kumar', 'email': 'goudariteshkumar1@gmail.com', 'password': 'Ritesh123'})
      );
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _token = data['token'];
        return true;
      } else {
        // If login fails, maybe user doesn't exist, let's try register
        final resReg = await http.post(
          Uri.parse('$nodeBaseUrl/register'),
          headers: {'Content-Type': 'application/json'},
          body: json.encode({'name': 'Ritesh Kumar', 'email': 'goudariteshkumar1@gmail.com', 'password': 'Ritesh123'})
        );
        if (resReg.statusCode == 201) {
          return await loginMock();
        }
      }
    } catch (e) {
      print('Auth error: $e');
    }
    return false;
  }

  // Helper for Node.js API Requests
  static Future<dynamic> _nodeGet(String endpoint) async {
    if (_token == null) await loginMock(); // Auto-login for mock purpose
    final response = await http.get(
      Uri.parse('$nodeBaseUrl$endpoint'),
      headers: {'Authorization': 'Bearer $_token'}
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load data: ${response.statusCode}');
    }
  }

  static Future<dynamic> _nodePost(String endpoint, Map<String, dynamic> body) async {
    if (_token == null) await loginMock();
    final response = await http.post(
      Uri.parse('$nodeBaseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_token'
      },
      body: json.encode(body)
    );
    if (response.statusCode == 200 || response.statusCode == 201) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to post data: ${response.statusCode}');
    }
  }

  // --- Market APIs ---
  static Future<List<dynamic>> getMarketIndices() async {
    return await _nodeGet('/market-indices');
  }

  static Future<List<dynamic>> getTopGainers() async {
    return await _nodeGet('/top-gainers');
  }

  static Future<List<dynamic>> getTopLosers() async {
    return await _nodeGet('/top-losers');
  }

  static Future<List<dynamic>> getStocks() async {
    return await _nodeGet('/stocks');
  }

  // --- Watchlist APIs ---
  static Future<List<dynamic>> getWatchlist() async {
    return await _nodeGet('/watchlist');
  }

  static Future<dynamic> addToWatchlist(String symbol) async {
    return await _nodePost('/watchlist', {'stockSymbol': symbol});
  }

  // --- Goal APIs ---
  static Future<dynamic> saveGoal(double targetAmount, int years) async {
    return await _nodePost('/save-goal', {
      'targetAmount': targetAmount,
      'years': years
    });
  }

  // --- AI API (FastAPI) ---
  static Future<String> askAi(String question) async {
    try {
      final response = await http.post(
        Uri.parse('$pythonBaseUrl/ask-ai'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'question': question})
      ).timeout(const Duration(seconds: 15));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return data['response'];
      }
      return 'Sorry, I am unable to answer right now.';
    } catch (e) {
      return 'Error connecting to AI Assistant. Make sure backend is running.';
    }
  }
}
