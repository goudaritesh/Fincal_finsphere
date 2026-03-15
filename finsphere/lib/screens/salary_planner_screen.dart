import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../services/api_service.dart';

class SalaryPlannerScreen extends StatefulWidget {
  const SalaryPlannerScreen({super.key});

  @override
  State<SalaryPlannerScreen> createState() => _SalaryPlannerScreenState();
}

class _SalaryPlannerScreenState extends State<SalaryPlannerScreen> {
  double _salary = 50000;
  bool _isVisible = false;
  bool _isAskingAi = false;

  Future<void> _askAI() async {
    setState(() => _isAskingAi = true);
    final prompt = "My monthly salary is ₹${_salary.toStringAsFixed(0)}. According to the 50-30-20 rule, my investment portion is ₹${(_salary * 0.20).toStringAsFixed(0)}. Can you suggest a good, safe mutual fund strategy or how I should allocate this twenty percent to build wealth safely?";
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
                const Text('AI Investment Strategy', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E5BB2))),
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

  Widget _buildSalaryPlanner() {
    double expenses = _salary * 0.50;
    double savings = _salary * 0.30;
    double investments = _salary * 0.20;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('Salary Investment Planner', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF1E5BB2))),
              const SizedBox(width: 8),
              Tooltip(
                message: 'A simple budgeting rule: 50% for Needs, 30% for Wants, and 20% for Savings/Investments.',
                triggerMode: TooltipTriggerMode.tap,
                child: Icon(Icons.info_outline, size: 18, color: Colors.grey.shade400),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Semantics(
            label: 'Monthly salary input',
            child: _buildSliderInput(
              'Monthly salary (₹)', 
              _salary, 10000, 500000, 1000, 
              (v) => setState(() => _salary = v),
              tooltip: 'Enter your take-home monthly salary.'
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              SizedBox(
                height: 120,
                width: 120,
                child: PieChart(
                  PieChartData(
                    sectionsSpace: 2,
                    centerSpaceRadius: 30,
                    sections: [
                      PieChartSectionData(color: Colors.orange, value: 50, title: '50%', radius: 25, titleStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
                      PieChartSectionData(color: Colors.blue, value: 30, title: '30%', radius: 25, titleStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
                      PieChartSectionData(color: Colors.green, value: 20, title: '20%', radius: 25, titleStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 24),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildLegendItem(Colors.orange, 'Expenses (50%)', expenses),
                    const SizedBox(height: 8),
                    _buildLegendItem(Colors.blue, 'Savings (30%)', savings),
                    const SizedBox(height: 8),
                    _buildLegendItem(Colors.green, 'Investments (20%)', investments),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            width: double.infinity,
            decoration: BoxDecoration(color: Colors.green.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
            child: Column(
              children: [
                const Text('Recommended Monthly SIP', style: TextStyle(fontSize: 12, color: Colors.grey)),
                const SizedBox(height: 4),
              ],
            ),
          ),
          const SizedBox(height: 16),
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
              label: Text(_isAskingAi ? 'Thinking...' : 'Optimize with AI 🧠', style: const TextStyle(fontWeight: FontWeight.bold)),
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

  Widget _buildLegendItem(Color color, String label, double amount) {
    return Row(
      children: [
        Container(width: 12, height: 12, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 8),
        Expanded(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(fontSize: 12)),
              Text('₹${amount.toStringAsFixed(0)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            ],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F7FA),
      appBar: AppBar(
        title: const Text('Salary Planner', style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold)),
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
              _buildSalaryPlanner(),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }
}
