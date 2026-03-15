class UserModel {
  final String name;
  final String email;
  final String? profileImage;
  final double totalInvested;
  final double monthlySavings;
  final String riskProfile;

  UserModel({
    required this.name,
    required this.email,
    this.profileImage,
    required this.totalInvested,
    required this.monthlySavings,
    required this.riskProfile,
  });

  factory UserModel.mock() {
    return UserModel(
      name: 'Ritesh Kumar',
      email: 'goudariteshkumar1@gmail.com',
      totalInvested: 250000.0,
      monthlySavings: 15000.0,
      riskProfile: 'Moderate-Aggressive',
    );
  }
}
