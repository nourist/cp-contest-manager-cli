#include <bits/stdc++.h>
using namespace std;

#define FOR(i,l,r) for (int i = l; i <= r; ++i)
#define FOD(i,r,l) for (int i = r; i >= l; --i)
#define ll long long
#define ld long double

string NAME = "{name}";
int NTEST = 100;

mt19937_64 rd(chrono::steady_clock::now().time_since_epoch().count());

long long Rand(long long L, long long R) {
	assert(L <= R);
	return L + rd() % (R - L + 1);
}

void gen() {
	ofstream inp((NAME + ".inp_").c_str());

	inp.close();
}

void compile() {
	system(("g++ -o " + NAME + "_1.exe " + NAME + "_1.cpp -std=c++17 -O2").c_str());
	system(("g++ -o " + NAME + "_2.exe " + NAME + "_2.cpp -std=c++17 -O2").c_str());
}

bool test() {
	system((NAME + "_1.exe < " + NAME + ".inp_ > " + NAME + ".out_1").c_str());
	system((NAME + "_2.exe < " + NAME + ".inp_ > " + NAME + ".out_2").c_str());

	return system(("fc " + NAME + ".out_1 " + NAME + ".out_2").c_str()) == 0;
}

int main() {
	ios_base::sync_with_stdio(false);
	cin.tie(NULL);
	cout.tie(NULL);

	compile();

	FOR(i, 1, NTEST) {
		gen();
		if (test()) {
			cout << "Test " << i << " OK\n";
		}
		else {
			cout << "Test " << i << " Wrong\n";
			return 0;
		}
	}
}