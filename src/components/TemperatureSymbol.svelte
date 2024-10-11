<script>
  import { temperatureUnitSymbols } from '../constants/temperatureUnitSymbols';
  import { temperatureUnit } from '../stores/temperature';
</script>

<span>
  {temperatureUnitSymbols[$temperatureUnit]}
</span>
