class StockModel {
  final String ticker;
  final double price;
  final double changeAmount;
  final double changePercentage;
  final int volume;

  StockModel({
    required this.ticker,
    required this.price,
    required this.changeAmount,
    required this.changePercentage,
    this.volume = 0,
  });

  bool get isPositive => changeAmount >= 0;

  String get formattedPrice => '₹${price.toStringAsFixed(2)}';
  String get formattedChange => '${isPositive ? '+' : ''}${changePercentage.toStringAsFixed(2)}%';
}
