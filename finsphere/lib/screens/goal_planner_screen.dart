import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'dart:math';
import '../services/api_service.dart';

class GoalPlannerScreen extends StatefulWidget {
  const GoalPlannerScreen({super.key});

  @override
  State<GoalPlannerScreen> createState() => _GoalPlannerScreenState();
}

class _GoalPlannerScreenState extends State<GoalPlannerScreen> {
  double _goalAmount = 1000000;
  int _goalYears = 5;
  bool _isSavingGoal = false;
  bool _isVisible = false;
  bool _isAskingAi = false;

  Future<void> _askAI() async {
    setState(() => _isAskingAi = true);
    
    double rate = 12.0; 
    int months = _goalYears * 12;
    double monthlyRate = (rate / 100) / 12;
    double reqMonthlyInvestment = _goalAmount / (((pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

    final prompt = "I have a financial goal to save ₹${_goalAmount.toStringAsFixed(0)} in $_goalYears years. To achieve this, I need to invest ₹${reqMonthlyInvestment.toStringAsFixed(0)} monthly. Can you advise me on what kind of investment instruments (like mutual funds, FDs, etc.) would be suitable for this timeline and amount?";
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
                const Text('AI Goal Strategy', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E5BB2))),
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

  Future<void> _saveGoal() async {
    setState(() => _isSavingGoal = true);
    
    try {
      await ApiService.saveGoal(_goalAmount, _goalYears);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Goal saved successfully!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to save Goal.')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSavingGoal = false);
    }
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

  Widget _buildGoalPlanner() {
    double rate = 12.0; // Assume 12% for goal planning
    int months = _goalYears * 12;
    double monthlyRate = (rate / 100) / 12;
    
    // P = FV / (({[1 + i]^n - 1} / i) × (1 + i))
    double reqMonthlyInvestment = _goalAmount / (((pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: _cardDecoration(),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('Goal Based Investment Planner', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF1E5BB2))),
              const SizedBox(width: 8),
              Tooltip(
                message: 'Calculate how much to save monthly to reach a specific life goal (like a car or house).',
                triggerMode: TooltipTriggerMode.tap,
                child: Icon(Icons.info_outline, size: 18, color: Colors.grey.shade400),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Semantics(
            label: 'Target amount for your goal',
            child: _buildSliderInput(
              'Target amount (₹)', 
              _goalAmount, 50000, 10000000, 10000, 
              (v) => setState(() => _goalAmount = v),
              tooltip: 'The total amount of money you want to accumulate.'
            ),
          ),
          Semantics(
            label: 'Time to reach goal in years',
            child: _buildSliderInput(
              'Time to goal (years)', 
              _goalYears.toDouble(), 1, 30, 1, 
              (v) => setState(() => _goalYears = v.toInt()),
              tooltip: 'The number of years you have to reach this target.'
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            width: double.infinity,
            decoration: BoxDecoration(color: const Color(0xFF1E5BB2).withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
            child: Column(
              children: [
                const Text('Required Monthly Investment', style: TextStyle(fontSize: 12, color: Colors.grey)),
                const SizedBox(height: 4),
                Text('₹${reqMonthlyInvestment.toStringAsFixed(0)}', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Color(0xFF1E5BB2))),
              ],
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 150,
            child: LineChart(
              LineChartData(
                gridData: const FlGridData(show: false),
                titlesData: const FlTitlesData(leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)), topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)), rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false))),
                borderData: FlBorderData(show: false),
                lineBarsData: [
                  LineChartBarData(
                    spots: List.generate(_goalYears + 1, (index) {
                      int m = index * 12;
                      double val = m == 0 ? 0 : reqMonthlyInvestment * ((pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate);
                      return FlSpot(index.toDouble(), val);
                    }),
                    isCurved: true,
                    color: const Color(0xFF42B3A6),
                    barWidth: 3,
                    isStrokeCapRound: true,
                    dotData: const FlDotData(show: false),
                    belowBarData: BarAreaData(
                      show: true,
                      color: const Color(0xFF42B3A6).withOpacity(0.2),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E5BB2),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: _isSavingGoal ? null : _saveGoal,
              child: _isSavingGoal
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Text('Save My Goal', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            ),
          ),
          const SizedBox(height: 12),
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
              label: Text(_isAskingAi ? 'Thinking...' : 'AI Goal Plan 🧠', style: const TextStyle(fontWeight: FontWeight.bold)),
              onPressed: _isAskingAi ? null : _askAI,
            ),
          )
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F7FA),
      appBar: AppBar(
        title: const Text('Goal Planner', style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold)),
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
              _buildGoalPlanner(),
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }
}
