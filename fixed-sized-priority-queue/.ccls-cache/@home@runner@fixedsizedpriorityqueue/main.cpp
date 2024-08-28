#include <algorithm>
#include <functional>
#include <iostream>
#include <queue>
#include <vector>

template <typename T,
          typename Compare = std::function<bool(const T &, const T &)>>
class FixedSizePQ {
private:
  using PQ = std::priority_queue<T, std::vector<T>,
                                 std::function<bool(const T &, const T &)>>;

public:
  FixedSizePQ(size_t size, const Compare &cmp)
      : size_(size), cmp_(cmp),
        pq_([&](const T &a, const T &b) -> bool { return cmp_(b, a); }) {}

  auto Empty() const -> bool { return this->pq_.empty(); }

  auto Count() const -> size_t { return this->pq_.size(); }

  void Pop() { this->pq_.pop(); }

  void Push(const T &value) {
    if (this->pq_.size() < this->size_) {
      this->pq_.push(value);
    } else if (this->cmp_(this->pq_.top(), value)) {
      this->pq_.pop();
      this->pq_.push(value);
    }
  }

  auto TransferToVector() -> std::vector<T> {
    std::vector<T> result(this->pq_.size());
    while (!this->pq_.empty()) {
      result[this->pq_.size() - 1] = this->pq_.top();
      this->pq_.pop();
    }
    return result;
  }

private:
  size_t size_;
  Compare cmp_;
  PQ pq_;
};

int main() {
  FixedSizePQ<int> pq(5);
  for (int i = 1; i <= 10; i++) {
    pq.Push(i);
  }
  for (auto &i : pq.TransferToVector()) {
    std::cout << i << std::endl;
  }
  return 0;
}