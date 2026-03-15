import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../services/api_service.dart';

class MarketScreen extends StatefulWidget {
  const MarketScreen({super.key});

  @override
  State<MarketScreen> createState() => _MarketScreenState();
}

class _MarketScreenState extends State<MarketScreen> {
  bool _isLoading = true;
  List<dynamic> _indices = [];
  List<dynamic> _gainers = [];
  List<dynamic> _losers = [];
  List<dynamic> _stocks = [];
  List<dynamic> _watchlist = [];
  String? _error;
  bool _isAskingAi = false;

  Future<void> _askAI() async {
    setState(() => _isAskingAi = true);
    
    String marketDataStr = "Market Indices: \n";
    for(var index in _indices.take(2)) {
      marketDataStr += "${index['name']}: ${index['value']} (${index['change']})\n";
    }
    marketDataStr += "\nTop Gainers: \n";
    for(var gainer in _gainers.take(3)) {
      marketDataStr += "${gainer['symbol']} (${gainer['change']})\n";
    }
    
    final prompt = "Here is today's stock market data:\n$marketDataStr\nCan you give a short 2-3 sentence summary of the market sentiment based on this data for a beginner investor?";
    
    try {
      final response = await ApiService.askAi(prompt);
      if (!mounted) return;
      
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (context) => Container(
          constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.8),
          padding: const EdgeInsets.only(top: 24, left: 24, right: 24, bottom: 40),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.auto_awesome, color: Color(0xFF1E5BB2)),
                  const SizedBox(width: 8),
                  const Text('AI Market Insight', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E5BB2))),
                  const Spacer(),
                  IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(context)),
                ],
              ),
              const Divider(),
              Flexible(
                child: SingleChildScrollView(
                  child: Text(response, style: const TextStyle(fontSize: 16, height: 1.5)),
                ),
              ),
            ],
          ),
        ),
      );
    } finally {
      if (mounted) setState(() => _isAskingAi = false);
    }
  }

  @override
  void initState() {
    super.initState();
    _fetchMarketData();
  }

  Future<void> _fetchMarketData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final futures = await Future.wait([
        ApiService.getMarketIndices(),
        ApiService.getTopGainers(),
        ApiService.getTopLosers(),
        ApiService.getStocks(),
        ApiService.getWatchlist(),
      ]);

      setState(() {
        _indices = futures[0];
        _gainers = futures[1];
        _losers = futures[2];
        _stocks = futures[3];
        _watchlist = futures[4];
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Failed to fetch market data. Make sure backend is running.';
        _isLoading = false;
      });
    }
  }

  Future<void> _addToWatchlist(String symbol) async {
    try {
      await ApiService.addToWatchlist(symbol);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$symbol added to watchlist!')),
      );
      _fetchMarketData(); // Refresh watchlist
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to add $symbol')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F7FA), // Soft background matches home
      appBar: AppBar(
        title: const Text('Markets', style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: false, 
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.blueAccent),
            onPressed: () => _fetchMarketData(),
          )
        ],
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator()) 
        : _error != null 
          ? Center(child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.error_outline, size: 48, color: Colors.red.shade300),
                const SizedBox(height: 16),
                Text(_error!),
                TextButton(onPressed: _fetchMarketData, child: const Text('Retry'))
              ],
            ))
          : SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: AnimatedOpacity(
                duration: const Duration(milliseconds: 500),
                opacity: _isLoading ? 0.0 : 1.0,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSearchBar(),
                    const SizedBox(height: 20),
                    const Text('Market Indices', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    const SizedBox(height: 12),
                    _buildMarketIndices(),
                    const SizedBox(height: 24),
                    _buildGainersLosersSection(),
                    const SizedBox(height: 24),
                    const Text('Stock List', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    const SizedBox(height: 12),
                    _buildStockList(),
                    const SizedBox(height: 24),
                    const Text('Your Watchlist', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
                    const SizedBox(height: 12),
                    _buildWatchlistCard(context),
                    const SizedBox(height: 20), // Bottom padding
                  ],
                ),
              ),
            ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: const Color(0xFF1E5BB2),
        onPressed: _isAskingAi ? null : _askAI,
        icon: _isAskingAi 
            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) 
            : const Icon(Icons.auto_awesome, color: Colors.white),
        label: Text(_isAskingAi ? 'Analyzing...' : 'AI Market Insight', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: const TextField(
        decoration: InputDecoration(
          hintText: 'Search stocks, funds...',
          hintStyle: TextStyle(color: Colors.grey, fontSize: 15),
          prefixIcon: Icon(Icons.search, color: Colors.grey),
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 15),
        ),
      ),
    );
  }

  Widget _buildMarketIndices() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: _indices.map((indexData) {
          final title = indexData['name'];
          final value = indexData['value'].toString();
          final changeString = indexData['change'] as String;
          final isPositive = changeString.startsWith('+');
          return Padding(
            padding: const EdgeInsets.only(right: 12.0),
            child: _buildIndexCard(title, value, changeString, isPositive),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildIndexCard(String title, String value, String change, bool isPositive) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeIn,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 8, offset: const Offset(0, 2)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 4),
          Text(change, style: TextStyle(color: isPositive ? Colors.green : Colors.red, fontWeight: FontWeight.bold, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildGainersLosersSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Top Gainers', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 5)],
          ),
          child: Column(
            children: _gainers.map((g) => _buildSimpleStockRow(g['symbol'], g['change'], true)).toList()
          ),
        ),
        const SizedBox(height: 20),
        const Text('Top Losers', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 5)],
          ),
          child: Column(
            children: _losers.map((l) => _buildSimpleStockRow(l['symbol'], l['change'], false)).toList()
          ),
        ),
      ],
    );
  }

  Widget _buildSimpleStockRow(String name, String change, bool isPositive) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(name, style: const TextStyle(fontSize: 14)),
          Text(change, style: TextStyle(color: isPositive ? Colors.green : Colors.red, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildStockList() {
    return Column(
      children: _stocks.map((stock) {
        final changeString = stock['change'] as String;
        final isPositive = changeString.startsWith('+');
        return Padding(
          padding: const EdgeInsets.only(bottom: 12.0),
          child: _buildStockCard(stock['symbol'], stock['name'], stock['price'].toString(), changeString, isPositive),
        );
      }).toList(),
    );
  }

  Widget _buildStockCard(String symbol, String name, String price, String change, bool isPositive) {
    // Generate dummy chart data for visual effect
    List<double> chartData = isPositive 
      ? [1, 1.5, 2, 2.5, 3] 
      : [3, 2.5, 2, 1.5, 1];

    return InkWell(
      onLongPress: () => _addToWatchlist(symbol),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 5)],
        ),
        child: Row(
          children: [
            Expanded(
              flex: 3,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(symbol, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  Text(name, style: const TextStyle(color: Colors.grey, fontSize: 12), overflow: TextOverflow.ellipsis),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              flex: 3,
              child: SizedBox(
                height: 30,
                child: LineChart(
                  LineChartData(
                    gridData: const FlGridData(show: false),
                    titlesData: const FlTitlesData(show: false),
                    borderData: FlBorderData(show: false),
                    minX: 0,
                    maxX: 4,
                    minY: 0,
                    maxY: 4,
                    lineBarsData: [
                      LineChartBarData(
                        spots: chartData.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value)).toList(),
                        isCurved: true,
                        color: isPositive ? Colors.green : Colors.red,
                        barWidth: 2,
                        isStrokeCapRound: true,
                        dotData: const FlDotData(show: false),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              flex: 3,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                   Text('₹$price', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Icon(isPositive ? Icons.arrow_upward : Icons.arrow_downward, color: isPositive ? Colors.green : Colors.red, size: 12),
                      Text(change, style: TextStyle(color: isPositive ? Colors.green : Colors.red, fontWeight: FontWeight.bold, fontSize: 12)),
                    ],
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWatchlistCard(BuildContext context) {
    if (_watchlist.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 5)],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('My Saved Stocks', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                SizedBox(height: 4),
                Text('Your watchlist is empty. Long press a stock to add.', style: TextStyle(color: Colors.grey, fontSize: 12)),
              ],
            ),
            Icon(Icons.bookmark_border, color: Theme.of(context).primaryColor),
          ],
        ),
      );
    }

    return Column(
      children: _watchlist.map((item) {
        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 5)],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(item['stock_symbol'] ?? 'Unknown', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              Icon(Icons.bookmark, color: Theme.of(context).primaryColor),
            ],
          ),
        );
      }).toList(),
    );
  }
}
