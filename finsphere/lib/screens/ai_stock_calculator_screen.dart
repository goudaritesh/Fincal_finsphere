import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AiStockCalculatorScreen extends StatefulWidget {
  const AiStockCalculatorScreen({super.key});

  @override
  State<AiStockCalculatorScreen> createState() => _AiStockCalculatorScreenState();
}

class _AiStockCalculatorScreenState extends State<AiStockCalculatorScreen> {
  final TextEditingController _buyPriceController = TextEditingController(text: '1000');
  final TextEditingController _sellPriceController = TextEditingController(text: '1200');
  final TextEditingController _quantityController = TextEditingController(text: '10');
  
  bool _isAskingAi = false;
  String _aiAdvice = "";

  void _calculateAndAskAi() async {
    double buy = double.tryParse(_buyPriceController.text) ?? 0;
    double sell = double.tryParse(_sellPriceController.text) ?? 0;
    int qty = int.tryParse(_quantityController.text) ?? 0;

    double profit = (sell - buy) * qty;
    double profitPct = buy > 0 ? ((sell - buy) / buy) * 100 : 0;

    setState(() {
      _isAskingAi = true;
      _aiAdvice = "";
    });

    final prompt = "I bought a stock at ₹$buy and sold at ₹$sell (Quantity: $qty). My total profit is ₹${profit.toStringAsFixed(2)} ($profitPct%). Can you explain the potential tax implications (like Short Term vs Long Term Capital Gains in India) and give a quick tip on what to do with this profit?";
    
    final response = await ApiService.askAi(prompt);

    if (mounted) {
      setState(() {
        _aiAdvice = response;
        _isAskingAi = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF3F7FA),
      appBar: AppBar(
        title: const Text('AI Profit Calculator', style: TextStyle(color: Colors.black87, fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.black87),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            _buildInputCard(),
            const SizedBox(height: 24),
            _buildResultCard(),
            if (_aiAdvice.isNotEmpty || _isAskingAi) ...[
              const SizedBox(height: 24),
              _buildAiAdviceCard(),
            ]
          ],
        ),
      ),
    );
  }

  Widget _buildInputCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
      ),
      child: Column(
        children: [
          Semantics(
            label: 'Stock buy price input',
            child: _buildTextField(
              'Buy Price (₹)', 
              _buyPriceController, 
              Icons.shopping_cart_outlined,
              tooltip: 'The price at which you originally purchased the stock share.'
            ),
          ),
          const SizedBox(height: 16),
          Semantics(
            label: 'Stock sell price input',
            child: _buildTextField(
              'Sell Price (₹)', 
              _sellPriceController, 
              Icons.sell_outlined,
              tooltip: 'The price at which you sold or plan to sell the stock share.'
            ),
          ),
          const SizedBox(height: 16),
          Semantics(
            label: 'Number of stocks owned',
            child: _buildTextField(
              'Quantity', 
              _quantityController, 
              Icons.layers_outlined,
              tooltip: 'The total number of units/shares you own.'
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF1E5BB2),
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: _isAskingAi ? null : _calculateAndAskAi,
              child: const Text('Calculate & Get AI Advice', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, IconData icon, {String? tooltip}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (tooltip != null) ...[
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 4),
            child: Row(
              children: [
                Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                const SizedBox(width: 4),
                Tooltip(
                  message: tooltip,
                  triggerMode: TooltipTriggerMode.tap,
                  child: Icon(Icons.help_outline, size: 14, color: Colors.grey.shade400),
                ),
              ],
            ),
          ),
        ],
        TextField(
          controller: controller,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            labelText: tooltip == null ? label : null,
            prefixIcon: Icon(icon, color: const Color(0xFF1E5BB2)),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: Colors.grey.shade200)),
          ),
        ),
      ],
    );
  }

  Widget _buildResultCard() {
    double buy = double.tryParse(_buyPriceController.text) ?? 0;
    double sell = double.tryParse(_sellPriceController.text) ?? 0;
    int qty = int.tryParse(_quantityController.text) ?? 0;
    double profit = (sell - buy) * qty;
    bool isProfit = profit >= 0;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: isProfit ? [Colors.green.shade400, Colors.green.shade700] : [Colors.red.shade400, Colors.red.shade700],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [BoxShadow(color: (isProfit ? Colors.green : Colors.red).withOpacity(0.3), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        children: [
          Text(isProfit ? 'Estimated Profit' : 'Estimated Loss', style: const TextStyle(color: Colors.white70, fontSize: 16)),
          const SizedBox(height: 8),
          Text('₹${profit.abs().toStringAsFixed(2)}', style: const TextStyle(color: Colors.white, fontSize: 32, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildAiAdviceCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFF1E5BB2).withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.auto_awesome, color: Color(0xFF1E5BB2)),
              SizedBox(width: 8),
              Text('AI Tax & Strategy Advice', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: Color(0xFF1E5BB2))),
            ],
          ),
          const Divider(height: 24),
          _isAskingAi 
            ? const Center(child: Padding(padding: EdgeInsets.all(20), child: CircularProgressIndicator()))
            : Text(_aiAdvice, style: const TextStyle(fontSize: 15, height: 1.5, color: Colors.black87)),
        ],
      ),
    );
  }
}
