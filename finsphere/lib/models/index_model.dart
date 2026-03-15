class IndexModel {
  final String name;
  final String symbol;
  final double currentPrice;
  final double previousClose;

  IndexModel({
    required this.name,
    required this.symbol,
    required this.currentPrice,
    required this.previousClose,
  });

  double get percentChange {
    if (previousClose == 0) return 0.0;
    return ((currentPrice - previousClose) / previousClose) * 100;
  }

  bool get isPositive => currentPrice >= previousClose;

  String get formattedPrice => currentPrice.toStringAsFixed(2).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},');
  String get formattedChange => '${isPositive ? '+' : ''}${percentChange.toStringAsFixed(2)}%';
}
