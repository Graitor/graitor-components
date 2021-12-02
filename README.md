# Graitor Components

United library for Graitor components used in internal systems.

Available components:
- GraitorChart
```javascript
<GraitorChart id={"chart"}
              title={"Graitor bar chart"}
              defaultType={"bar"}
              dataset={{
                '2021-10-17': 1,
                '2021-10-18': 4,
                '2021-10-19': 150,
              }}
              formatLabels={(label) => {
                if (label === "unknown") return "?"
                const parts = label.split(/-+/g)
                return `${parts[2]}/${parts[1]} ${parts[0]}`
              }}
/>
```
- GraitorDropdown
```javascript
<GraitorDropdown title={"Language"}
                 defaultItem={{ key: 'en', value: 'English' }}
                 options={[
                   { key: 'da', value: 'Dansk' },
                   { key: 'en', value: 'English' },
                   { key: 'de', value: 'Deutsch' },
                   { key: 'sk', value: 'Slovenčina' },
                 ]}
                 onChange={(oldValue, newValue) => {
                   setValue(newValue)
                 }}
/>
```