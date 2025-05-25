import plotly.graph_objects as go
from plotly.subplots import make_subplots

labels = ['Avant indexation', 'Après indexation']
temps = [2, 1]            # en ms
docs_examines = [64, 9]   # nombre de documents

fig = make_subplots(rows=2, cols=1, shared_xaxes=True,
                    subplot_titles=('Temps d\'exécution (ms)', 'Documents examinés'))

fig.add_trace(go.Scatter(
    x=labels,
    y=temps,
    mode='lines+markers',
    name='Temps d\'exécution (ms)',
    line=dict(color='firebrick', width=6),
    marker=dict(size=14, color='firebrick', line=dict(width=2, color='darkred'))
), row=1, col=1)

fig.add_trace(go.Scatter(
    x=labels,
    y=docs_examines,
    mode='lines+markers',
    name='Documents examinés',
    line=dict(color='royalblue', width=6, dash='dash'),
    marker=dict(size=14, color='royalblue', line=dict(width=2, color='darkblue'))
), row=2, col=1)

fig.update_layout(
    height=650,
    title_text="Comparaison Performances Avant/Après Indexation",
    template='plotly_white',
    font=dict(size=16),
    legend=dict(
        orientation='h',
        yanchor='bottom',
        y=1.02,
        xanchor='right',
        x=1
    ),

    # Personnalisation de la grille sur les deux axes
    xaxis=dict(
        showgrid=True,
        gridcolor='lightgray',
        gridwidth=2,
        zeroline=False,
        tickfont=dict(size=14)
    ),
    yaxis=dict(
        showgrid=True,
        gridcolor='lightgray',
        gridwidth=2,
        zeroline=False,
        tickfont=dict(size=14)
    ),
    xaxis2=dict(
        showgrid=True,
        gridcolor='lightgray',
        gridwidth=2,
        zeroline=False,
        tickfont=dict(size=14)
    ),
    yaxis2=dict(
        showgrid=True,
        gridcolor='lightgray',
        gridwidth=2,
        zeroline=False,
        tickfont=dict(size=14)
    )
)

fig.show()
