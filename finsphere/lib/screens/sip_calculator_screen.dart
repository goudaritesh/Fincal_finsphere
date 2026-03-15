import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'dart:math';
import '../services/api_service.dart';

class SipCalculatorScreen extends StatefulWidget {
  const SipCalculatorScreen({super.key});

  @override
  State<SipCalculatorScreen> createState() => _SipCalculatorScreenState();
}

class _SipCalculatorScreenState extends State<SipCalculatorScreen> {
  double _sipMonthly = 5000;
  double _sipRate = 12; // Annual rate in %
  int _sipYears = 10;
  bool _isVisible = false;
  bool _isAskingAi = false;
  final TextEditingController _stockController = TextEditingController();
  final TextEditingController _stockSipAmountController = TextEditingController(text: '5000');
  final TextEditingController _stockSipYearsController = TextEditingController(text: '10');

  Future<void> _askAI({bool isStockAnalysis = false}) async {
    setState(() => _isAskingAi = true);
    
    String prompt;
    if (isStockAnalysis && _stockController.text.isNotEmpty) {
      final amount = _stockSipAmountController.text;
      final years = _stockSipYearsController.text;
      prompt = "I want to start a Stock SIP. Stock: ${_stockController.text}, Monthly Investment: ₹$amount, Time Period: $years years. "
               "Please analyze the current market scenario for this stock, suggest a realistic potential profit/ROI, and provide a clear investment strategy for this specific stock SIP.";
    } else {
      prompt = "I am calculating a SIP. I plan to invest ₹${_sipMonthly.toStringAsFixed(0)} every month for $_sipYears years at an expected return of $_sipRate%. Can you give me a short, friendly beginner strategy or mutual fund category recommendation for this?";
    }

    final response = await ApiService.askAi(prompt);
    
    if (!mounted) return;
    setState(() => _isAskingAi = false);
    
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
                Text(isStockAnalysis ? 'AI Stock Analysis' : 'AI Strategy', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E5BB2))),
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
  }

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 100), () {
      if (mounted) setState(() => _isVisible = true);
    });
  }

  BoxDecoration _cardDecoration() {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      boxShadow: [
        BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
      ],
    );
  }

  Widget _buildSipCalculator() {
    int months = _sipYears * 12;
    double monthlyRate = (_sipRate / 100) / 12;
    // FV = P × ({[1 + i]^n - 1} / i) × (1 + i)
    double futureValue = _sipMonthly * ((pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    double totalInvestment = _sipMonthly * months;
    double expectedReturns = futureValue - totalInvestment;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('SIP Calculator', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF1E5BB2))),
              const SizedBox(width: 8),
              Tooltip(
                message: 'Systematic Investment Plan: Investing a fixed amount regularly to build wealth.',
                triggerMode: TooltipTriggerMode.tap,
                child: Icon(Icons.info_outline, size: 18, color: Colors.grey.shade400),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Semantics(
            label: 'Monthly investment amount in rupees',
            child: _buildSliderInput(
              'Monthly investment (₹)', 
              _sipMonthly, 500, 100000, 500, 
              (v) => setState(() => _sipMonthly = v),
              tooltip: 'The amount you save every month.'
            ),
          ),
          Semantics(
            label: 'Expected return rate percentage',
            child: _buildSliderInput(
              'Expected return rate (%)', 
              _sipRate, 1, 30, 0.5, 
              (v) => setState(() => _sipRate = v),
              tooltip: 'The annual percentage growth you expect from your investment.'
            ),
          ),
          Semantics(
            label: 'Investment time period in years',
            child: _buildSliderInput(
              'Time period (years)', 
              _sipYears.toDouble(), 1, 40, 1, 
              (v) => setState(() => _sipYears = v.toInt()),
              tooltip: 'How long you plan to keep investing. Longer periods benefit more from compounding.'
            ),
          ),
          const Divider(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildResultItem('Invested', totalInvestment, Colors.grey.shade700),
              _buildResultItem('Returns', expectedReturns, Colors.green),
              _buildResultItem('Total Value', futureValue, const Color(0xFF1E5BB2), isBold: true),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 120,
            child: PieChart(
              PieChartData(
                sectionsSpace: 0,
                centerSpaceRadius: 40,
                sections: [
                  PieChartSectionData(color: Colors.grey.shade300, value: totalInvestment, title: 'Invested', radius: 15, showTitle: false),
                  PieChartSectionData(color: Colors.green, value: expectedReturns, title: 'Returns', radius: 15, showTitle: false),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E5BB2).withOpacity(0.1),
                foregroundColor: const Color(0xFF1E5BB2),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                elevation: 0,
              ),
              icon: _isAskingAi 
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2)) 
                  : const Icon(Icons.auto_awesome),
              label: Text(_isAskingAi ? 'Thinking...' : 'Get AI Strategy 🧠', style: const TextStyle(fontWeight: FontWeight.bold)),
              onPressed: _isAskingAi ? null : _askAI,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSliderInput(String label, double value, double min, double max, double div, ValueChanged<double> onChanged, {String? tooltip}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Text(label, style: const TextStyle(fontSize: 14)),
                if (tooltip != null) ...[
                  const SizedBox(width: 4),
                  Tooltip(
                    message: tooltip,
                    triggerMode: TooltipTriggerMode.tap,
                    child: Icon(Icons.help_outline, size: 14, color: Colors.grey.shade400),
                  ),
                ],
              ],
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(color: Colors.grey.shade100, borderRadius: BorderRadius.circular(4)),
              child: Text(
                label.contains('years') || label.contains('%') ? value.toStringAsFixed(1).replaceAll('.0', '') : '₹${value.toStringAsFixed(0)}',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        SliderTheme(
          data: SliderTheme.of(context).copyWith(
            trackHeight: 2,
            activeTrackColor: const Color(0xFF1E5BB2),
            inactiveTrackColor: Colors.grey.shade300,
            thumbColor: const Color(0xFF1E5BB2),
            overlayColor: const Color(0xFF1E5BB2).withOpacity(0.2),
            thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
          ),
          child: Slider(
            value: value,
            min: min,
            max: max,
            divisions: ((max - min) / div).round(),
            onChanged: onChanged,
          ),
        ),
      ],
    );
  }

  Widget _buildResultItem(String label, double val, Color color, {bool isBold = false}) {
    return Column(
      children: [
        Text(label, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
        const SizedBox(height: 4),
        Text(
          '₹${_formatCurrency(val)}',
          style: TextStyle(fontWeight: isBold ? FontWeight.bold : FontWeight.w600, fontSize: isBold ? 16 : 14, color: color),
        ),
      ],
    );
  }

  String _formatCurrency(double value) {
    if (value >= 10000000) {
      return '${(value / 10000000).toStringAsFixed(2)} Cr';
    } else if (value >= 100000) {
      return '${(value / 100000).toStringAsFixed(2)} L';
    } else {
      return value.toStringAsFixed(0);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F7FA),
      appBar: AppBar(
        title: const Text('SIP Calculator', style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.black87),
      ),
      body: AnimatedOpacity(
        duration: const Duration(milliseconds: 600),
        opacity: _isVisible ? 1.0 : 0.0,
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            children: [
              _buildSipCalculator(),
              const SizedBox(height: 16),
              _buildStockSipAnalysisCard(),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }
  Widget _buildStockSipAnalysisCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.auto_graph, color: Color(0xFF1E5BB2), size: 20),
              SizedBox(width: 8),
              Text('AI Stock SIP Analyzer', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF1E5BB2))),
            ],
          ),
          const SizedBox(height: 12),
          const Text('Analyze specific stocks for your monthly SIP strategy.', style: TextStyle(fontSize: 13, color: Colors.grey)),
          const SizedBox(height: 16),
          TextField(
            controller: _stockController,
            decoration: InputDecoration(
              hintText: 'Enter Stock Name (e.g. RELIANCE, TCS)',
              labelText: 'Stock Name',
              prefixIcon: const Icon(Icons.search, size: 20),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _stockSipAmountController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'Monthly Invest (₹)',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: _stockSipYearsController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'Period (Years)',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E5BB2),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: _isAskingAi ? null : () => _askAI(isStockAnalysis: true),
              child: _isAskingAi 
                  ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Text('Analyze Market Scenario 🚀', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }
}
