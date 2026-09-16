import unittest

def calculate_ogra_delta(c_and_f_today: float, c_and_f_yesterday: float) -> float:
    return round((c_and_f_today - c_and_f_yesterday) / 158.987, 2)

def circuit_breaker(raw_ai_delta: float, formula_delta: float) -> float:
    if formula_delta >= 0.50 and raw_ai_delta < 0:
        return formula_delta
    if formula_delta <= -0.50 and raw_ai_delta > 0:
        return formula_delta
    return raw_ai_delta

class TestFuelGuardGuardrails(unittest.TestCase):
    def test_4_day_crude_surge(self):
        oil_yesterday_7d = 94.26
        oil_today_7d = 95.96
        pkr_7d = 275.77
        c_and_f_prev = oil_yesterday_7d * pkr_7d
        c_and_f_today = oil_today_7d * pkr_7d
        delta = calculate_ogra_delta(c_and_f_today, c_and_f_prev)
        self.assertGreater(delta, 0)
        self.assertAlmostEqual(delta, 2.94, places=1)

    def test_circuit_breaker_blocks_erroneous_drop(self):
        raw_buggy_ai_delta = -2.50
        formula_delta = 2.94
        guarded_delta = circuit_breaker(raw_buggy_ai_delta, formula_delta)
        self.assertEqual(guarded_delta, 2.94)

    def test_circuit_breaker_blocks_erroneous_hike(self):
        raw_buggy_ai_delta = 3.00
        formula_delta = -2.50
        guarded_delta = circuit_breaker(raw_buggy_ai_delta, formula_delta)
        self.assertEqual(guarded_delta, -2.50)

    def test_price_sanity_boundaries(self):
        base_petrol = 370.81
        delta = 2.94
        predicted = base_petrol + delta
        self.assertTrue(300.0 <= predicted <= 450.0)

if __name__ == '__main__':
    unittest.main()
