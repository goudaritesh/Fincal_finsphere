import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../services/market_api_service.dart';
import '../services/api_service.dart';
import '../models/index_model.dart';
import '../models/stock_model.dart';
import 'package:provider/provider.dart';
import '../services/navigation_provider.dart';
import 'sip_calculator_screen.dart';
import 'salary_planner_screen.dart';
import 'goal_planner_screen.dart';
import 'ai_stock_calculator_screen.dart';
import 'tutorial_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final MarketApiService _apiService = MarketApiService();

  IndexModel? _nifty;
  IndexModel? _sensex;
  List<StockModel> _gainers = [];
  List<StockModel> _losers = [];
  bool _isLoading = true;
  String _aiTip = 'Start investing early to benefit from compound growth.';
  bool _isLoadingTip = false;

  @override
  void initState() {
    super.initState();
    _fetchMarketData();
    _fetchAiTip();
  }

  Future<void> _fetchAiTip() async {
    setState(() => _isLoadingTip = true);
    try {
      final response = await ApiService.askAi("Give me a short, 1-sentence financial or investing tip of the day for a beginner.");
      if (mounted) {
        setState(() {
          _aiTip = response;
          _isLoadingTip = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoadingTip = false);
    }
  }

  Future<void> _fetchMarketData() async {
    setState(() => _isLoading = true);

    try {
      // Execute API calls concurrently
      final responses = await Future.wait([
        _apiService.fetchIndex('^NSEI', 'NIFTY 50'),
        _apiService.fetchIndex('^BSESN', 'SENSEX'),
        _apiService.fetchTopGainersLosers(),
      ]);

      setState(() {
        _nifty = responses[0] as IndexModel?;
        _sensex = responses[1] as IndexModel?;
        
        final glData = responses[2] as Map<String, List<StockModel>>;
        _gainers = glData['gainers'] ?? [];
        _losers = glData['losers'] ?? [];
      });
    } catch (e) {
      print('Error pulling dash data: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F7FA), // Soft background
      appBar: AppBar(
        title: const Text('Smart Investor', style: TextStyle(color: Color(0xFF1E5BB2), fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          if (_isLoading)
            const Center(child: Padding(padding: EdgeInsets.only(right: 16), child: SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)))),
          IconButton(icon: const Icon(Icons.notifications_none, color: Colors.black), onPressed: () {}),
          GestureDetector(
            onTap: () {
              Provider.of<NavigationProvider>(context, listen: false).setIndex(3);
            },
            child: const Padding(
              padding: EdgeInsets.only(right: 16.0),
              child: CircleAvatar(
                radius: 16,
                child: Icon(Icons.person, size: 20),
              ),
            ),
          )
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _fetchMarketData,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildGreetingSection(),
              const SizedBox(height: 16),
              _buildQuickTourCard(),
              const SizedBox(height: 20),
              _buildMarketOverviewCard(),
              const SizedBox(height: 16),
              _buildMarketSentimentCard(),
              const SizedBox(height: 16),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: _buildTopGainersCard()),
                  const SizedBox(width: 16),
                  Expanded(child: _buildTopLosersCard()),
                ],
              ),
              const SizedBox(height: 20),
              _buildInvestmentToolsSection(),
              const SizedBox(height: 20),
              _buildMarketTrendChart(),
              const SizedBox(height: 20),
              _buildTipOfTheDayCard(),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  // Helper method for styling cards
  BoxDecoration _cardDecoration() {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      boxShadow: [
        BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, spreadRadius: 2, offset: const Offset(0, 4)),
      ],
    );
  }

  Widget _buildGreetingSection() {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Good Morning, Ritesh Kumar ', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF1E5BB2))),
        SizedBox(height: 4),
        Text('Your Financial Dashboard', style: TextStyle(fontSize: 16, color: Colors.grey)),
      ],
    );
  }

  Widget _buildMarketOverviewCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Market Overview', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _isLoading 
                  ? const Text("Loading NIFTY...") 
                  : _buildIndexItem(_nifty?.name ?? 'NIFTY 50', _nifty?.formattedPrice ?? '-', _nifty?.formattedChange ?? '-', _nifty?.isPositive ?? true),
              _isLoading 
                  ? const Text("Loading SENSEX...") 
                  : _buildIndexItem(_sensex?.name ?? 'SENSEX', _sensex?.formattedPrice ?? '-', _sensex?.formattedChange ?? '-', _sensex?.isPositive ?? true),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildIndexItem(String title, String value, String percent, bool isPositive) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.black87)),
        const SizedBox(height: 4),
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            const SizedBox(width: 8),
            Container(
               padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
               decoration: BoxDecoration(color: isPositive ? Colors.green.withOpacity(0.1) : Colors.red.withOpacity(0.1), borderRadius: BorderRadius.circular(4)),
               child: Row(
                 children: [
                   Icon(isPositive ? Icons.arrow_upward : Icons.arrow_downward, size: 12, color: isPositive ? Colors.green : Colors.red),
                   Text(percent, style: TextStyle(color: isPositive ? Colors.green : Colors.red, fontWeight: FontWeight.bold, fontSize: 12)),
                 ],
               ),
            ),
          ],
        )
      ],
    );
  }

  Widget _buildMarketSentimentCard() {
    // Determine Sentiment dynamically based on fetched indices or fallback to 68%
    int sentiment = 68; // default
    if (_nifty != null && _sensex != null) {
      if (_nifty!.isPositive && _sensex!.isPositive) sentiment = 75;
      else if (!_nifty!.isPositive && !_sensex!.isPositive) sentiment = 25;
      else sentiment = 50;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: _cardDecoration(),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text('Market Sentiment', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(color: sentiment > 50 ? Colors.green : Colors.red, shape: BoxShape.circle),
                child: Icon(sentiment > 50 ? Icons.arrow_upward : Icons.arrow_downward, color: Colors.white, size: 16),
              ),
              const SizedBox(width: 8),
              Text('$sentiment% Stocks Rising', style: TextStyle(fontWeight: FontWeight.w600, color: sentiment > 50 ? Colors.green : Colors.red)),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildTopGainersCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Top Gainers', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 12),
          if (_isLoading) const CircularProgressIndicator(),
          if (!_isLoading && _gainers.isNotEmpty) 
            ..._gainers.map((g) => _buildStockItem(g.ticker, g.formattedChange, true)),
          if (!_isLoading && _gainers.isEmpty)
            const Text("No data available"),
        ],
      ),
    );
  }

  Widget _buildTopLosersCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Top Losers', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          const SizedBox(height: 12),
          if (_isLoading) const CircularProgressIndicator(),
          if (!_isLoading && _losers.isNotEmpty) 
            ..._losers.map((l) => _buildStockItem(l.ticker, l.formattedChange, false)),
          if (!_isLoading && _losers.isEmpty)
             const Text("No data available"),
        ],
      ),
    );
  }

  Widget _buildStockItem(String name, String percent, bool isPositive) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Flexible(child: Text(name, style: const TextStyle(fontSize: 14), overflow: TextOverflow.ellipsis)),
          Row(
            children: [
              Text(percent, style: TextStyle(color: isPositive ? Colors.green : Colors.red, fontWeight: FontWeight.bold, fontSize: 14)),
              Icon(isPositive ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, color: isPositive ? Colors.green : Colors.red, size: 16),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInvestmentToolsSection() {
    return Column(
      children: [
        Row(
          children: [
            Expanded(
              child: _buildToolCard(
                Icons.calculate,
                'SIP\nCalculator',
                () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SipCalculatorScreen())),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildToolCard(
                Icons.monetization_on,
                'Salary Investment\nPlanner',
                () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SalaryPlannerScreen())),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _buildToolCard(
                Icons.track_changes,
                'Goal\nPlanner',
                () => Navigator.push(context, MaterialPageRoute(builder: (_) => const GoalPlannerScreen())),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildToolCard(
                Icons.auto_graph,
                'AI Stock\nCalculator',
                () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AiStockCalculatorScreen())),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildToolCard(IconData icon, String title, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
        decoration: _cardDecoration(),
        child: Column(
          children: [
            Icon(icon, color: const Color(0xFF1E5BB2), size: 32),
            const SizedBox(height: 12),
            Text(title, textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildMarketTrendChart() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Market Trend', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          const SizedBox(height: 20),
          SizedBox(
            height: 150,
            child: LineChart(
              LineChartData(
                gridData: const FlGridData(show: false),
                titlesData: const FlTitlesData(show: false),
                borderData: FlBorderData(show: false),
                minX: 0, maxX: 6, minY: 0, maxY: 6,
                lineBarsData: [
                  LineChartBarData(
                    spots: const [FlSpot(0, 2), FlSpot(1, 1.5), FlSpot(2, 3), FlSpot(3, 2.5), FlSpot(4, 4), FlSpot(5, 3), FlSpot(6, 5)],
                    isCurved: true,
                    color: const Color(0xFF42B3A6),
                    barWidth: 3,
                    isStrokeCapRound: true,
                    dotData: FlDotData(show: true, checkToShowDot: (spot, barData) => spot.x == 4),
                    belowBarData: BarAreaData(show: true, color: const Color(0xFF42B3A6).withOpacity(0.2)),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTipOfTheDayCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.auto_awesome, color: Color(0xFF1E5BB2), size: 20),
              const SizedBox(width: 8),
              const Text('AI Tip of the Day', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            ],
          ),
          const SizedBox(height: 12),
          _isLoadingTip 
            ? const SizedBox(height: 16, width: 16, child: CircularProgressIndicator(strokeWidth: 2))
            : Text(_aiTip, style: const TextStyle(fontSize: 14, color: Colors.black87, height: 1.4)),
        ],
      ),
    );
  }

  Widget _buildQuickTourCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF1E5BB2), Color(0xFF4A8FE7)]),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: const Color(0xFF1E5BB2).withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Row(
        children: [
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('New to Investing?', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                SizedBox(height: 4),
                Text('Take a quick tour of FinSphere AI.', style: TextStyle(color: Colors.white70, fontSize: 12)),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const TutorialScreen())),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: const Color(0xFF1E5BB2),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            ),
            child: const Text('Start Tour'),
          ),
        ],
      ),
    );
  }
}
