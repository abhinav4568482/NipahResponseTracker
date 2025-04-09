// Indian states
export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// State coordinates for map centering
export const stateCoordinates: {[key: string]: [number, number]} = {
  "Andhra Pradesh": [15.9129, 79.7400],
  "Arunachal Pradesh": [28.2180, 94.7278],
  "Assam": [26.2006, 92.9376],
  "Bihar": [25.0961, 85.3131],
  "Chhattisgarh": [21.2787, 81.8661],
  "Goa": [15.2993, 74.1240],
  "Gujarat": [22.2587, 71.1924],
  "Haryana": [29.0588, 76.0856],
  "Himachal Pradesh": [31.1048, 77.1734],
  "Jharkhand": [23.6102, 85.2799],
  "Karnataka": [15.3173, 75.7139],
  "Kerala": [10.8505, 76.2711],
  "Madhya Pradesh": [22.9734, 78.6569],
  "Maharashtra": [19.7515, 75.7139],
  "Manipur": [24.6637, 93.9063],
  "Meghalaya": [25.4670, 91.3662],
  "Mizoram": [23.1645, 92.9376],
  "Nagaland": [26.1584, 94.5624],
  "Odisha": [20.9517, 85.0985],
  "Punjab": [31.1471, 75.3412],
  "Rajasthan": [27.0238, 74.2179],
  "Sikkim": [27.5330, 88.5122],
  "Tamil Nadu": [11.1271, 78.6569],
  "Telangana": [18.1124, 79.0193],
  "Tripura": [23.9408, 91.9882],
  "Uttar Pradesh": [26.8467, 80.9462],
  "Uttarakhand": [30.0668, 79.0193],
  "West Bengal": [22.9868, 87.8550]
};

// Sample default coordinates for districts, organized by state
export const districtCoordinates: {[key: string]: {[key: string]: [number, number]}} = {
  "Sikkim": {
    "Gangtok": [27.3389, 88.6065],
    "Namchi": [27.1667, 88.3833],
    "Gyalshing": [27.2833, 88.2667],
    "Mangan": [27.5088, 88.5319],
    "Rangpo": [27.1767, 88.5419],
    "Singtam": [27.2333, 88.5000],
    "Jorethang": [27.1070, 88.3217],
    "Nayabazar": [27.1289, 88.1369],
    "Chungthang": [27.6025, 88.6464],
    "Ravangla": [27.3033, 88.3656]
  },
  "Meghalaya": {
    "Shillong": [25.5788, 91.8933],
    "Tura": [25.5144, 90.2141],
    "Jowai": [25.4333, 92.2000],
    "Nongstoin": [25.5167, 91.2667],
    "Williamnagar": [25.4800, 90.6167],
    "Baghmara": [25.1833, 90.6333],
    "Resubelpara": [25.9000, 90.5833],
    "Khliehriat": [25.3500, 92.3667],
    "Mawkyrwat": [25.2931, 91.5819],
    "Ampati": [25.3833, 89.9333]
  }
};

// District map - organized by state
export const districtsByState: {[key: string]: string[]} = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Tirupati", "Guntur", "Nellore", "Kurnool", "Kakinada", "Anantapur", "Kadapa", "Eluru", "Ongole"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Bomdila", "Ziro", "Tezu", "Roing", "Yingkiong", "Aalo"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur", "Nagaon", "Bongaigaon", "Tinsukia", "Goalpara", "Karimganj", "Dhubri"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Arrah", "Begusarai", "Chhapra", "Katihar", "Purnia", "Samastipur"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Bhilai", "Korba", "Durg", "Rajnandgaon", "Raigarh", "Jagdalpur", "Ambikapur", "Dhamtari"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Curchorem", "Canacona", "Bicholim", "Pernem", "Quepem"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Junagadh", "Anand", "Bharuch", "Patan"],
  "Haryana": ["Faridabad", "Gurgaon", "Panipat", "Ambala", "Hisar", "Karnal", "Rohtak", "Sonipat", "Yamunanagar", "Panchkula"],
  "Himachal Pradesh": ["Shimla", "Mandi", "Dharamshala", "Solan", "Kullu", "Hamirpur", "Nahan", "Chamba", "Bilaspur", "Una"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh", "Phusro", "Medininagar"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Belagavi", "Kalaburagi", "Hubballi", "Shivamogga", "Tumakuru", "Davanagere", "Ballari", "Vijayapura"],
  "Kerala": ["Kozhikode", "Malappuram", "Kannur", "Wayanad", "Thrissur", "Palakkad", "Ernakulam", "Idukki", "Thiruvananthapuram", "Kollam", "Kottayam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Dewas", "Satna", "Rewa", "Ratlam", "Singrauli"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Nanded", "Sangli"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Senapati", "Ukhrul", "Chandel", "Churachandpur", "Tamenglong", "Jiribam", "Kangpokpi"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Williamnagar", "Baghmara", "Resubelpara", "Khliehriat", "Mawkyrwat", "Ampati"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Kolasib", "Serchhip", "Siaha", "Lawngtlai", "Mamit", "Khawzawl", "Saitual"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto", "Phek", "Mon", "Peren", "Kiphire"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur", "Puri", "Balasore", "Bhadrak", "Baripada", "Jeypore", "Jharsuguda"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Hoshiarpur", "Mohali", "Batala", "Pathankot", "Moga"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bharatpur", "Sikar", "Alwar", "Bhilwara"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Singtam", "Jorethang", "Nayabazar", "Chungthang", "Ravangla"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirapalli", "Tirunelveli", "Erode", "Tiruppur", "Vellore", "Thanjavur", "Dindigul"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet", "Siddipet"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia", "Khowai", "Ambassa", "Sonamura", "Sabroom", "Santirbazar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj", "Aligarh", "Bareilly", "Moradabad", "Saharanpur"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh", "Pithoragarh", "Ramnagar", "Khatima"],
  "West Bengal": ["Kolkata", "Siliguri", "Howrah", "Darjeeling", "Jalpaiguri", "Cooch Behar", "Alipurduar", "Durgapur", "Asansol", "Kharagpur", "Malda"]
};